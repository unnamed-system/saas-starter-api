import { Subscription } from '@domain/entities/subscription';
import { EEvent } from '@domain/enums/EEvent';
import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import { EPaymentType } from '@domain/enums/EPaymentType';
import { EQueue } from '@domain/enums/EQueue';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { addDays } from 'date-fns';
import { SubscriptionService } from '../subscription.service';

@Processor(EQueue.SUBSCRIPTION_RENEWAL)
export class SubscriptionRenewalConsumer extends WorkerHost {
	@Inject()
	private readonly subscriptionService: SubscriptionService;
	@Inject() private readonly eventEmitter: EventEmitter2;

	private readonly logger = new Logger(SubscriptionRenewalConsumer.name);

	public async process({ data }: Job<Subscription>) {
		try {
			const lastPaymentIndex = data.payments.length - 1;
			const lastPaymentMethod = data.payments[lastPaymentIndex].method;
			const newPayment = {
				subscriptionId: data.id,
				amount: data.recurrence.amount,
				dueAt: new Date(),
				status: EPaymentStatus.PENDING,
				type: EPaymentType.SUBSCRIPTION,
				method: lastPaymentMethod,
			};

			this.eventEmitter.emit(EEvent.RENEWAL_PAYMENT, newPayment);

			const nextPaymentAt = addDays(new Date(), data.recurrence.durationInDays);
			await this.subscriptionService.update(data.id, { nextPaymentAt });
		} catch (error) {
			this.logger.error('Erro ao tentar renovar assinatura:', error);
			throw error;
		}
	}
}
