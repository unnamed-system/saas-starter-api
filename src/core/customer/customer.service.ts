import { Customer } from '@domain/entities/customer';
import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
	@InjectRepository(Customer) private readonly repository: Repository<Customer>;

	public async find() {
		return this.repository.find({
			relations: ['subscriptions'],
			order: {
				subscriptions: {
					status: 'ASC',
				},
			},
		});
	}

	public async create(data: CreateCustomerDto) {
		const { email, document, googleId } = data;

		const where: Partial<Customer>[] = [];
		if (email) where.push({ email });
		if (document) where.push({ document });
		if (googleId) where.push({ googleId });

		if (where.length > 0) {
			const customerExists = await this.repository.findOne({
				where,
			});

			if (customerExists) {
				throw new ConflictException('Já existe uma conta cadastrada.');
			}
		}

		const customer = this.repository.create(data);
		return this.repository.save(customer);
	}

	public async findOne(filters: FindOptionsWhere<Customer>) {
		const customer = await this.repository.findOne({
			where: filters,
		});

		if (!customer) {
			throw new NotFoundException('Usuário não encontrado.');
		}

		return customer;
	}

	public async changeSubscription(customerId: string, subscriptionId: string) {
		const customer = await this.findOne({ id: customerId });

		customer.subscriptionId = subscriptionId;
		await this.repository.save(customer);
	}
}
