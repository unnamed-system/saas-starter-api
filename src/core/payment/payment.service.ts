import { Payment } from '@domain/entities/payment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
	@InjectRepository(Payment) private readonly repository: Repository<Payment>;

	public async create(data: CreatePaymentDto) {
		const payment = this.repository.create(data);
		return this.repository.save(payment);
	}
}
