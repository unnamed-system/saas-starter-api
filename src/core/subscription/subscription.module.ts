import { CustomerModule } from '@core/customer/customer.module';
import { PaymentModule } from '@core/payment/payment.module';
import { PlanModule } from '@core/plan/plan.module';
import { Subscription } from '@domain/entities/subscription';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Subscription]),
		CustomerModule,
		PlanModule,
		PaymentModule,
	],
	controllers: [SubscriptionController],
	providers: [SubscriptionService],
})
export class SubscriptionModule {}
