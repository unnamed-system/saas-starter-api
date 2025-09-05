import { EEvent } from '@domain/enums/EEvent';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SubscriptionExpirationCron {
	@Inject() private readonly eventEmitter: EventEmitter2;

	// @Cron(CronExpression.EVERY_DAY_AT_3AM)
	@Cron(CronExpression.EVERY_30_SECONDS)
	public handleExpiration() {
		this.eventEmitter.emit(EEvent.SUBSCRIPTION_EXPIRATION);
	}
}
