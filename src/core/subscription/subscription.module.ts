import { CustomerModule } from '@core/customer/customer.module';
import { PaymentModule } from '@core/payment/payment.module';
import { PlanRecurrenceModule } from '@core/plan-recurrence/plan-recurrence.module';
import { PlanModule } from '@core/plan/plan.module';
import { Subscription } from '@domain/entities/subscription';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsModule } from 'src/jobs/jobs.module';

import { SubscriptionExpirationListener } from './listeners/subscription-expiration.listener';
import { SubscriptionRenewalListener } from './listeners/subscription-renewal.listener';
import { SubscriptionRenewalProcessor } from './processors/subscription-renewal.processor';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionListener } from './subscription.listener';
import { SubscriptionService } from './subscription.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Subscription]),
		JobsModule,
		CustomerModule,
		PlanModule,
		PlanRecurrenceModule,
		PaymentModule,
	],
	controllers: [SubscriptionController],
	providers: [
		SubscriptionService,
		SubscriptionListener,
		SubscriptionExpirationListener,
		SubscriptionRenewalListener,
		SubscriptionRenewalProcessor,
	],
	exports: [SubscriptionService, SubscriptionRenewalProcessor],
})
export class SubscriptionModule {}
