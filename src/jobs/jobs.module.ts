import { EQueue } from '@domain/enums/EQueue';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionExpirationCron } from './cron/subscription-expiration.cron';
import { SubscriptionRenewalCron } from './cron/subscription-renewal.cron';
import { JobsService } from './jobs.service';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		BullModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				connection: {
					host: configService.get('redis.host'),
					port: configService.get<number>('redis.port'),
					username: configService.get('redis.username'),
					password: configService.get('redis.password'),
				},
				defaultJobOptions: {
					removeOnComplete: true,
				},
			}),
		}),
		BullModule.registerQueue({
			name: EQueue.SUBSCRIPTION_RENEWAL,
		}),
		BullModule.registerQueue({
			name: EQueue.SUBSCRIPTION_EXPIRATION,
		}),
	],
	providers: [JobsService, SubscriptionRenewalCron, SubscriptionExpirationCron],
	exports: [JobsService, BullModule],
})
export class JobsModule {}
