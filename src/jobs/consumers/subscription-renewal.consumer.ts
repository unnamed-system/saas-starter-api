import { SubscriptionRenewalProcessor } from '@core/subscription/processors/subscription-renewal.processor';
import { Subscription } from '@domain/entities/subscription';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('subscription.renewal')
export class SubscriptionRenewalConsumer extends WorkerHost {
	@Inject()
	private readonly subscriptionRenewalProcessor: SubscriptionRenewalProcessor;

	public async process({ data }: Job<Subscription>) {
		await this.subscriptionRenewalProcessor.execute(data);
	}
}
