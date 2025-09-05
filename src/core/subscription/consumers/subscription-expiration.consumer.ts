import { Subscription } from '@domain/entities/subscription';
import { EQueue } from '@domain/enums/EQueue';
import { ESubscriptionStatus } from '@domain/enums/ESubscriptionStatus';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SubscriptionService } from '../subscription.service';

@Processor(EQueue.SUBSCRIPTION_EXPIRATION)
export class SubscriptionExpirationConsumer extends WorkerHost {
	@Inject()
	private readonly subscriptionService: SubscriptionService;

	private readonly logger = new Logger(SubscriptionExpirationConsumer.name);

	public async process({ data }: Job<Subscription>) {
		try {
			await this.subscriptionService.update(data.id, {
				status: ESubscriptionStatus.CANCELED,
				nextPaymentAt: undefined,
				expirationAt: new Date(),
			});
		} catch (error) {
			this.logger.error('Erro ao tentar expirar assinatura:', error);
			throw error;
		}
	}
}
