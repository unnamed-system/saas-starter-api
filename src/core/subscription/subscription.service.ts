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
import { Repository } from 'typeorm';
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

	public async upgrade(data: CreateSubscriptionDto) {
		await this.handleActiveSubscription(data.customerId);
		const subscription = await this.createSubscription(data);
		await this.createInitialPayment(subscription, data.method);
		await this.customerService.update(data.customerId, {
			subscriptionId: subscription.id,
		});

		return subscription;
	}

	public async cancel(id: string) {
		const subscription = await this.repository.findOneBy({ id });

		if (!subscription) {
			throw new NotFoundException('Assinatura não encontrada.');
		}

		this.repository.merge(subscription, {
			renewal: false,
			canceledAt: new Date(),
		});
		return this.repository.save(subscription);
	}

	private async handleActiveSubscription(customerId: string) {
		const activeSubscription = await this.repository.findOne({
			where: { customerId, status: ESubscriptionStatus.ACTIVE },
		});

		if (activeSubscription) {
			activeSubscription.status = ESubscriptionStatus.CANCELED;
			activeSubscription.endDate = new Date();
			await this.repository.save(activeSubscription);
		}
	}

	private async createSubscription(
		data: CreateSubscriptionDto,
	): Promise<Subscription> {
		const activeSubscription = await this.repository.findOneBy({
			customerId: data.customerId,
			status: ESubscriptionStatus.ACTIVE,
		});

		if (activeSubscription) {
			throw new BadRequestException(
				'Já existe uma assinatura em andamento para este cliente.',
			);
		}

		const subscription = this.repository.create(data);

		return this.repository.save(subscription);
	}

	private async createInitialPayment(
		subscription: Subscription,
		method: EPaymentMethod,
	) {
		const plan = await this.planService.findOne({ id: subscription.planId });

		await this.paymentService.create({
			subscriptionId: subscription.id,
			method,
			value: plan.amount,
			status: EPaymentStatus.PENDING,
			dueDate: this.calculateDueDate(subscription.startDate, plan.cycle),
		});
	}

	private calculateDueDate(startDate: Date, cycle: EPlanCycle): Date {
		const due = new Date(startDate);
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
}
