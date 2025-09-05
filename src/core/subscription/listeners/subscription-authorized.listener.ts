import { PaymentService } from '@core/payment/payment.service';
import { EEvent } from '@domain/enums/EEvent';
import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import { ESubscriptionStatus } from '@domain/enums/ESubscriptionStatus';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { addDays } from 'date-fns';
import { SubscriptionAuthorizedEvent } from '../events/subscription-authorized.event';
import { SubscriptionService } from '../subscription.service';

@Injectable()
export class SubscriptionAuthorizedListener {
	@Inject() private readonly subscriptionService: SubscriptionService;
	@Inject() private readonly paymentService: PaymentService;

	@OnEvent(EEvent.PAYMENT_CONFIRMED)
	public async execute(event: SubscriptionAuthorizedEvent) {
		const subscription = await this.subscriptionService.findOne({
			externalId: event.id,
		});

		const payment = await this.paymentService.findOne({
			subscriptionId: subscription.id,
		});

		await this.paymentService.update(payment.id, {
			status: EPaymentStatus.CONFIRMED,
		});

		console.log(payment);
		await this.subscriptionService.update(subscription.id, {
			startAt: new Date(),
			nextPaymentAt: addDays(
				new Date(),
				subscription.recurrence.durationInDays,
			),
			status: ESubscriptionStatus.ACTIVE,
		});
	}
}
