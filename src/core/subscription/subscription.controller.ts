import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
	@Inject() private readonly subscriptionService: SubscriptionService;

	@Get()
	public find() {
		return this.subscriptionService.find();
	}

	@Post()
	public create(@Body() data: CreateSubscriptionDto) {
		return this.subscriptionService.create(data);
	}
}
