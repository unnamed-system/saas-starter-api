import database from '@config/database';
import { Customer } from '@domain/entities/customer';
import { Payment } from '@domain/entities/payment';
import { Plan } from '@domain/entities/plan';
import { Subscription } from '@domain/entities/subscription';
import { WebhookLog } from '@domain/entities/webhook-log';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './core/customer/customer.module';
import { PaymentModule } from './core/payment/payment.module';
import { PlanModule } from './core/plan/plan.module';
import { SubscriptionModule } from './core/subscription/subscription.module';
import { WebhookModule } from './core/webhook/webhook.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [database],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('database.host'),
				port: configService.get('database.port'),
				username: configService.get('database.username'),
				password: configService.get('database.password'),
				database: 'saas_starter',
				synchronize: true,
				logging: false,
				entities: [Customer, Payment, Plan, Subscription, WebhookLog],
			}),
		}),
		CustomerModule,
		PaymentModule,
		WebhookModule,
		SubscriptionModule,
		PlanModule,
	],
})
export class AppModule {}
