import { EEvent } from '@domain/enums/EEvent';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SubscriptionRenewalCron {
	@Inject() private readonly eventEmitter: EventEmitter2;

	// @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	@Cron(CronExpression.EVERY_10_SECONDS)
	public handleRenewal() {
		this.eventEmitter.emit(EEvent.SUBSCRIPTION_RENEWAL);
	}
}
