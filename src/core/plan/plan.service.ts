import { Plan } from '@domain/entities/plan';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanService {
	@InjectRepository(Plan) private readonly repository: Repository<Plan>;

	public async findOne(filters: FindOptionsWhere<Plan>) {
		const plan = await this.repository.findOne({
			where: filters,
		});

		if (!plan) {
			throw new NotFoundException('Plano não encontrado.');
		}

		return plan;
	}

	public async create(data: CreatePlanDto) {
		const plan = this.repository.create(data);
		return this.repository.save(plan);
	}
}
