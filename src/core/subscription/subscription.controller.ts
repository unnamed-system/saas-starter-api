import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	ParseUUIDPipe,
	Post,
} from '@nestjs/common';
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
	public upgrade(@Body() data: CreateSubscriptionDto) {
		return this.subscriptionService.upgrade(data);
	}

	@Post('cancel/:id')
	public cancel(@Param('id', ParseUUIDPipe) id: string) {
		return this.subscriptionService.cancel(id);
	}
}
