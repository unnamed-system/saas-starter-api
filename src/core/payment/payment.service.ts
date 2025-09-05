import { Payment } from '@domain/entities/payment';
import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
	@InjectRepository(Payment) private readonly repository: Repository<Payment>;

	public async create(data: CreatePaymentDto) {
		const payment = this.repository.create(data);
		return this.repository.save(payment);
	}

	public async findOne(filters: FindOptionsWhere<Payment>) {
		const payment = await this.repository.findOne({
			where: filters,
			order: { createdAt: 'DESC' },
		});

		if (!payment) {
			throw new NotFoundException('Pagamento não encontrado.');
		}

		return payment;
	}

	public async findLastPaid(subscriptionId: string) {
		const payment = await this.repository.findOne({
			where: { subscriptionId, status: EPaymentStatus.CONFIRMED },
			order: { createdAt: 'DESC' },
		});

		if (!payment) {
			throw new NotFoundException('Pagamento não encontrado.');
		}

		return payment;
	}

	public async update(id: string, data: UpdatePaymentDto) {
		const payment = await this.findOne({ id });

		this.repository.merge(payment, data);
		await this.repository.save(payment);
	}
}
