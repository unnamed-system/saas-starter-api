import { Payment } from '@domain/entities/payment';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'rxjs';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
	imports: [TypeOrmModule.forFeature([Payment, Subscription])],
	controllers: [PaymentController],
	providers: [PaymentService],
	exports: [PaymentService],
})
export class PaymentModule {}
