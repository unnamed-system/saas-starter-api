import { Subscription } from '@domain/entities/subscription';
import { EEvent } from '@domain/enums/EEvent';
import { EQueue } from '@domain/enums/EQueue';
import { ESubscriptionStatus } from '@domain/enums/ESubscriptionStatus';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { IsNull, LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class SubscriptionRenewalListener {
	@InjectRepository(Subscription)
	private readonly repository: Repository<Subscription>;

	@InjectQueue(EQueue.SUBSCRIPTION_RENEWAL) private readonly queue: Queue;
	private readonly logger = new Logger(SubscriptionRenewalListener.name);

	@OnEvent(EEvent.SUBSCRIPTION_RENEWAL)
	public async execute() {
		const subscriptions = await this.repository.find({
			where: {
				status: ESubscriptionStatus.ACTIVE,
				renewal: true,
				nextPaymentAt: LessThanOrEqual(new Date()),
				canceledAt: IsNull(),
			},
			relations: ['recurrence', 'payments'],
		});

		for (const subscription of subscriptions) {
			this.queue.add(EEvent.SUBSCRIPTION_RENEWAL, subscription);
		}

		if (subscriptions.length) {
			this.logger.debug(
				`${subscriptions.length} assinaturas alocadas na fila de renovação.`,
			);
		}
	}
}
