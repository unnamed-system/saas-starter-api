import { Subscription } from '@domain/entities/subscription';
import { EEvent } from '@domain/enums/EEvent';
import { ESubscriptionStatus } from '@domain/enums/ESubscriptionStatus';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionExpirationListener {
	@InjectRepository(Subscription)
	private readonly repository: Repository<Subscription>;

	private readonly logger = new Logger(SubscriptionExpirationListener.name);

	@OnEvent(EEvent.SUBSCRIPTION_EXPIRATION)
	public async execute() {
		const result = await this.repository
			.createQueryBuilder()
			.update(Subscription)
			.set({
				status: ESubscriptionStatus.CANCELED,
				nextPaymentAt: () => 'NULL',
				expirationAt: new Date(),
			})
			.where('status = :status', { status: ESubscriptionStatus.ACTIVE })
			.andWhere('renewal = :renewal', { renewal: false })
			.andWhere('next_payment_at <= :now', { now: new Date() })
			.andWhere('canceled_at IS NOT NULL')
			.execute();

		this.logger.debug(`${result.affected} assinaturas expiradas.`);
	}
}
