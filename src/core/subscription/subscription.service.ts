import { CustomerService } from '@core/customer/customer.service';
import { PaymentService } from '@core/payment/payment.service';
import { PlanService } from '@core/plan/plan.service';
import { Subscription } from '@domain/entities/subscription';
import { EPaymentMethod } from '@domain/enums/EPaymentMethod';
import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import { EPlanCycle } from '@domain/enums/EPlanCycle';
import { ESubscriptionStatus } from '@domain/enums/ESubscriptionStatus';
import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, isBefore } from 'date-fns';
import { Repository } from 'typeorm';
import { ChangePlanDto } from './dto/change-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
	@InjectRepository(Subscription)
	private readonly repository: Repository<Subscription>;

	@Inject() private readonly customerService: CustomerService;
	@Inject() private readonly paymentService: PaymentService;
	@Inject() private readonly planService: PlanService;

	public async find() {
		return this.repository.find();
	}

	public async create(customerId: string, data: CreateSubscriptionDto) {
		const activeSubscription = await this.repository.findOneBy({
			customerId,
			status: ESubscriptionStatus.ACTIVE,
		});

		if (activeSubscription) {
			throw new BadRequestException(
				'Já existe uma assinatura em andamento para este cliente.',
			);
		}

		await this.planService.findOne({ id: data.planId });

		const subscription = this.repository.create({ ...data, customerId });
		await this.repository.save(subscription);
		await this.customerService.update(customerId, {
			subscriptionId: subscription.id,
		});

		await this.createInitialPayment(subscription, data.method);

		return subscription;
	}

	public async changePlan(customerId: string, data: ChangePlanDto) {
		const activeSubscription = await this.repository.findOneBy({
			customerId,
			status: ESubscriptionStatus.ACTIVE,
		});

		if (!activeSubscription) {
			throw new BadRequestException('Não possui assinatura ativa para trocar.');
		}

		const [{ method }, oldPlan, newPlan] = await Promise.all([
			this.paymentService.findOne({
				subscriptionId: activeSubscription.id,
			}),
			this.planService.findOne({
				id: activeSubscription.planId,
			}),
			this.planService.findOne({
				id: data.planId,
			}),
		]);

		const now = new Date();
		const oldStartAt = activeSubscription.startAt;

		const oldEndOfCycle = this.calculatedueAt(oldStartAt, oldPlan.cycle);
		const totalDays =
			(oldEndOfCycle.getTime() - oldStartAt.getTime()) / (1000 * 60 * 60 * 24);

		const remainingDays =
			(oldEndOfCycle.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

		const credit = (oldPlan.amount / totalDays) * remainingDays;
		const newPlanAmount = newPlan.amount;
		const valueToCharge =
			Math.round(Math.max(newPlanAmount - credit, 0) * 100) / 100;
		const discount = Math.round(Math.max(credit, 0) * 100) / 100;

		this.repository.merge(activeSubscription, {
			startAt: new Date(),
			planId: data.planId,
		});
		await this.repository.save(activeSubscription);

		await this.paymentService.create({
			subscriptionId: activeSubscription.id,
			method,
			value: valueToCharge,
			discount,
			status: EPaymentStatus.PENDING,
			dueAt: oldEndOfCycle,
			notes: 'Troca de plano requisitada pelo usuário',
		});

		return activeSubscription;
	}

	private async createInitialPayment(
		subscription: Subscription,
		method: EPaymentMethod,
		value?: number,
	) {
		const plan = await this.planService.findOne({ id: subscription.planId });

		await this.paymentService.create({
			subscriptionId: subscription.id,
			method,
			value: value ?? plan.amount,
			status: EPaymentStatus.PENDING,
			dueAt: this.calculatedueAt(subscription.startAt, plan.cycle),
		});
	}

	private calculatedueAt(startAt: Date, cycle: EPlanCycle): Date {
		const due = new Date(startAt);
		switch (cycle) {
			case EPlanCycle.WEEKLY:
				due.setDate(due.getDate() + 7);
				break;
			case EPlanCycle.MONTHLY:
				due.setMonth(due.getMonth() + 1);
				break;
			case EPlanCycle.YEARLY:
				due.setFullYear(due.getFullYear() + 1);
				break;
		}
		return due;
	}

	public async cancel(customerId: string) {
		const subscription = await this.repository.findOneBy({
			customerId,
			status: ESubscriptionStatus.ACTIVE,
		});

		if (!subscription) {
			throw new NotFoundException('Você não possui assinatura ativa.');
		}

		this.repository.merge(subscription, {
			renewal: false,
			canceledAt: new Date(),
		});
		return this.repository.save(subscription);
	}

	public async refund(customerId: string) {
		const subscription = await this.repository.findOneBy({
			customerId,
			status: ESubscriptionStatus.ACTIVE,
		});

		if (!subscription) {
			throw new NotFoundException('Você não possui assinatura.');
		}

		const refundDeadline = addDays(subscription.startAt, 7);
		const now = new Date();

		if (
			!isBefore(now, refundDeadline) &&
			now.getTime() !== refundDeadline.getTime()
		) {
			throw new BadRequestException(
				'O período de 7 dias para solicitar reembolso encerrou.',
			);
		}

		this.repository.merge(subscription, {
			renewal: false,
			canceledAt: now,
			status: ESubscriptionStatus.CANCELED,
			endAt: now,
		});

		await this.repository.save(subscription);

		const payment = await this.paymentService.findLastPaid(subscription.id);

		await this.paymentService.update(payment.id, {
			status: EPaymentStatus.REFUNDED,
			refundedAt: new Date(),
			notes: 'Reembolso solicitado pelo usuário',
		});
	}
}
