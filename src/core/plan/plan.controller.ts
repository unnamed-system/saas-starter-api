import { Controller, Get, Inject } from '@nestjs/common';
import { PlanService } from './plan.service';

@Controller('plans')
export class PlanController {
	@Inject() private readonly planService: PlanService;

	@Get()
	public findAll() {
		return this.planService.findAll();
	}
}
