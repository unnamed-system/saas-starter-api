import { Plan } from '@domain/entities/plan';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
	imports: [TypeOrmModule.forFeature([Plan])],
	controllers: [PlanController],
	providers: [PlanService],
	exports: [PlanService],
})
export class PlanModule {}
