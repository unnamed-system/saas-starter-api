import { Body, Controller, Get, Headers, Inject, Post } from '@nestjs/common';
import { ChangePlanDto } from './dto/change-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
	@Inject() private readonly subscriptionService: SubscriptionService;

	@Get()
	public find() {
		return this.subscriptionService.find();
	}

	@Get('history')
	public findSubscriptionHistory(@Headers('customerId') customerId: string) {
		return this.subscriptionService.findSubscriptionHistory(customerId);
	}

	@Post('upgrade')
	public upgrade(
		@Headers('customerId') customerId: string,
		@Body() data: CreateSubscriptionDto,
	) {
		return this.subscriptionService.create(customerId, data);
	}

	@Post('cancel')
	public cancel(@Headers('customerId') customerId: string) {
		return this.subscriptionService.cancel(customerId);
	}

	@Post('change-plan')
	public changePlan(
		@Headers('customerId') customerId: string,
		@Body() data: ChangePlanDto,
	) {
		return this.subscriptionService.changePlan(customerId, data);
	}

	@Post('refund')
	public refund(@Headers('customerId') customerId: string) {
		return this.subscriptionService.refund(customerId);
	}
}
