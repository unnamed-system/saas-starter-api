import { EQueue } from '@domain/enums/EQueue';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class SubscriptionRenewalQueue {
	@InjectQueue(EQueue.SUBSCRIPTION_RENEWAL) private readonly queue: Queue;
}
