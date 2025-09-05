import { Subscription } from '@domain/entities/subscription';
import { EEvent } from '@domain/enums/EEvent';
import { EQueue } from '@domain/enums/EQueue';
import { ESubscriptionStatus } from '@domain/enums/ESubscriptionStatus';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionExpirationListener {
	@InjectRepository(Subscription)
	private readonly repository: Repository<Subscription>;
	@InjectQueue(EQueue.SUBSCRIPTION_EXPIRATION) private readonly queue: Queue;

	private readonly logger = new Logger(SubscriptionExpirationListener.name);

	@OnEvent(EEvent.SUBSCRIPTION_EXPIRATION)
	public async execute() {
		const subscriptions = await this.repository
			.createQueryBuilder()
			.where('status = :status', { status: ESubscriptionStatus.ACTIVE })
			.andWhere('renewal = :renewal', { renewal: false })
			.andWhere('next_payment_at <= :now', { now: new Date() })
			.andWhere('canceled_at IS NOT NULL')
			.getMany();

		if (!subscriptions.length) return;

		for (const subscription of subscriptions) {
			this.queue.add(EEvent.SUBSCRIPTION_EXPIRATION, subscription);
		}

		this.logger.debug(
			`${
				subscriptions.length > 1
					? ` ${subscriptions.length} assinaturas`
					: '1 assinatura'
			} aguardando expiração.`,
		);
	}
}
