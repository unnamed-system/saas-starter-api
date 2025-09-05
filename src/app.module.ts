import database from '@config/database';
import redis from '@config/redis';
import { PlanRecurrenceModule } from '@core/plan-recurrence/plan-recurrence.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { RedisModule } from '@infrastructure/redis/redis.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './core/auth/auth.module';
import { CustomerModule } from './core/customer/customer.module';
import { PaymentModule } from './core/payment/payment.module';
import { PlanModule } from './core/plan/plan.module';
import { SubscriptionModule } from './core/subscription/subscription.module';
import { WebhookModule } from './core/webhook/webhook.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [database, redis],
		}),
		EventEmitterModule.forRoot(),
		DatabaseModule,
		JobsModule,
		RedisModule,
		CustomerModule,
		PaymentModule,
		WebhookModule,
		SubscriptionModule,
		PlanModule,
		PlanRecurrenceModule,
		AuthModule,
	],
})
export class AppModule {}
