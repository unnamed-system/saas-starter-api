import { PlanRecurrence } from '@domain/entities/plan-recurrence';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlanRecurrenceService {
	@InjectRepository(PlanRecurrence)
	private readonly repository: Repository<PlanRecurrence>;

	public async findById(id: number): Promise<PlanRecurrence> {
		const planRecurrence = await this.findOne({ id, active: true });
		return planRecurrence;
	}

	public async findOne(filters: Partial<PlanRecurrence>) {
		const planRecurrence = await this.repository.findOne({
			where: filters,
		});

		if (!planRecurrence) {
			throw new NotFoundException('Plano de recorrência não encontrado.');
		}

		return planRecurrence;
	}
}
