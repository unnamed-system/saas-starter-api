import { EEvent } from '@domain/enums/EEvent';
import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('webhook')
export class WebhookController {
	@Inject() private readonly eventEmitter: EventEmitter2;

	@Post()
	@HttpCode(200)
	public handleWebhook(@Body() payload: any) {
		switch (payload.event) {
			case 'PAYMENT_CONFIRMED':
				this.eventEmitter.emit(EEvent.PAYMENT_CONFIRMED, payload);
				break;
		}
	}
}
