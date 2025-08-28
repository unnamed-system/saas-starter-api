import {
	Body,
	Controller,
	Get,
	Headers,
	Inject,
	Param,
	ParseUUIDPipe,
	Post,
} from '@nestjs/common';
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

	@Post('refund/:id')
	public refund(@Param('id', ParseUUIDPipe) id: string) {
		return this.subscriptionService.refund(id);
	}
}
