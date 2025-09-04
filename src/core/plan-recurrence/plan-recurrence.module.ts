import { PlanRecurrence } from '@domain/entities/plan-recurrence';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanRecurrenceService } from './plan-recurrence.service';

@Module({
	imports: [TypeOrmModule.forFeature([PlanRecurrence])],
	providers: [PlanRecurrenceService],
	exports: [PlanRecurrenceService],
})
export class PlanRecurrenceModule {}
