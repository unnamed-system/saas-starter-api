import { SubscriptionModule } from '@core/subscription/subscription.module';
import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionRenewalConsumer } from './consumers/subscription-renewal.consumer';
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
			}),
		}),
		BullModule.registerQueue({
			name: 'subscription.renewal',
		}),
		forwardRef(() => SubscriptionModule),
	],
	providers: [
		JobsService,
		SubscriptionRenewalCron,
		SubscriptionExpirationCron,
		SubscriptionRenewalConsumer,
	],
	exports: [JobsService, BullModule],
})
export class JobsModule {}
