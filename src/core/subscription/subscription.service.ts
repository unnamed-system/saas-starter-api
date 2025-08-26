import { CustomerService } from '@core/customer/customer.service';
import { PaymentService } from '@core/payment/payment.service';
import { PlanService } from '@core/plan/plan.service';
import {
	ESubscriptionStatus,
	Subscription,
} from '@domain/entities/subscription';
import { EPaymentMethod } from '@domain/enums/EPaymentMethod';
import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import { EPlanCycle } from '@domain/enums/EPlanCycle';
import { Inject, Injectable } from '@nestjs/common';
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

	public async create(data: CreateSubscriptionDto) {
		await this.handleActiveSubscription(data.customerId);
		const subscription = await this.createSubscription(data);
		await this.createInitialPayment(subscription, data.method);
		await this.customerService.changeSubscription(
			data.customerId,
			subscription.id,
		);

		return subscription;
	}

	private async handleActiveSubscription(customerId: string) {
		const active = await this.repository.findOne({
			where: { customerId, status: ESubscriptionStatus.ACTIVE },
		});

		if (active) {
			active.status = ESubscriptionStatus.CANCELED;
			active.endDate = new Date();
			await this.repository.save(active);
		}
	}

	private async createSubscription(
		data: CreateSubscriptionDto,
	): Promise<Subscription> {
		const subscription = this.repository.create({
			customerId: data.customerId,
			planId: data.planId,
			status: ESubscriptionStatus.ACTIVE,
			startDate: new Date(),
		});
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
