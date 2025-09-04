import { CustomerModule } from '@core/customer/customer.module';
import { PaymentModule } from '@core/payment/payment.module';
import { PlanRecurrenceModule } from '@core/plan-recurrence/plan-recurrence.module';
import { PlanModule } from '@core/plan/plan.module';
import { Subscription } from '@domain/entities/subscription';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionListener } from './subscription.listener';
import { SubscriptionProcessor } from './subscription.processor';
import { SubscriptionService } from './subscription.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Subscription]),
		CustomerModule,
		PlanModule,
		PlanRecurrenceModule,
		PaymentModule,
	],
	controllers: [SubscriptionController],
	providers: [SubscriptionService, SubscriptionListener, SubscriptionProcessor],
	exports: [SubscriptionService],
})
export class SubscriptionModule {}
