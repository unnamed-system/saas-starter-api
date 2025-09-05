import { PaymentService } from '@core/payment/payment.service';
import { Subscription } from '@domain/entities/subscription';
import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import { EPaymentType } from '@domain/enums/EPaymentType';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { addDays } from 'date-fns';
import { SubscriptionService } from '../subscription.service';

@Injectable()
export class SubscriptionRenewalProcessor {
	private readonly logger = new Logger(SubscriptionRenewalProcessor.name);

	@Inject() private readonly subscriptionService: SubscriptionService;
	@Inject() private readonly paymentService: PaymentService;

	public async execute(subscription: Subscription) {
		const lastPaymentMethod =
			subscription.payments[subscription.payments.length - 1].method;

		await this.paymentService.create({
			subscriptionId: subscription.id,
			amount: subscription.recurrence.amount,
			dueAt: new Date(),
			status: EPaymentStatus.PENDING,
			type: EPaymentType.SUBSCRIPTION,
			method: lastPaymentMethod,
		});

		const nextPaymentAt = addDays(
			new Date(),
			subscription.recurrence.durationInDays,
		);

		await this.subscriptionService.update(subscription.id, { nextPaymentAt });
	}
}
