import { CustomerService } from '@core/customer/customer.service';
import { PaymentService } from '@core/payment/payment.service';
import { PlanRecurrenceService } from '@core/plan-recurrence/plan-recurrence.service';
import { PlanService } from '@core/plan/plan.service';
import { Subscription } from '@domain/entities/subscription';
import { EPaymentMethod } from '@domain/enums/EPaymentMethod';
import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import { EPaymentType } from '@domain/enums/EPaymentType';
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
	@Inject() private readonly planRecurrenceService: PlanRecurrenceService;

	public async find() {
		return this.repository.find({
			relations: ['recurrence', 'recurrence.plan'],
		});
	}

	public async findSubscriptionHistory(customerId: string) {
		const subscriptionHistory = this.repository
			.createQueryBuilder('subscription')
			.leftJoinAndSelect('subscription.recurrence', 'recurrence')
			.leftJoinAndSelect('recurrence.plan', 'plan')
			.where('subscription.customerId = :customerId', { customerId })
			.select([
				'subscription.id',
				'subscription.customerId',
				'subscription.status',
				'subscription.startAt',
				'subscription.endAt',
				'subscription.canceledAt',
				'subscription.createdAt',
				'recurrence.cycle',
				'recurrence.amount',
				'plan.name',
			])
			.getMany();

		return subscriptionHistory;
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

		await this.planService.findById(data.planId);
		const { amount } = await this.planRecurrenceService.findOne({
			id: data.recurrenceId,
			planId: data.planId,
		});

		const subscription = this.repository.create({
			...data,
			customerId,
		});

		await this.repository.save(subscription);
		await this.createInitialPayment(subscription, data.method, amount);
		await this.customerService.update(customerId, {
			subscriptionId: subscription.id,
		});

		return subscription;
	}

	// Reescrever totalmente esse método de troca de plano ou recorrência
	public async changePlan(customerId: string, data: ChangePlanDto) {
		const activeSubscription = await this.repository.findOneBy({
			customerId,
			status: ESubscriptionStatus.ACTIVE,
		});

		if (!activeSubscription) {
			throw new BadRequestException('Não possui assinatura ativa para trocar.');
		}
	}

	private async createInitialPayment(
		subscription: Subscription,
		method: EPaymentMethod,
		amount: number,
	) {
		await this.paymentService.create({
			subscriptionId: subscription.id,
			method,
			amount,
			status: EPaymentStatus.PENDING,
			dueAt: addDays(new Date(), 1),
			type: EPaymentType.SUBSCRIPTION,
		});
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

		if (!subscription.startAt) {
			throw new BadRequestException('Não é possível solicitar reembolso.');
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
