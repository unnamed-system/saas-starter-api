import { EEvent } from '@domain/enums/EEvent';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RenewalPaymentEvent } from '../events/renewal-payment.event';
import { PaymentService } from '../payment.service';

@Injectable()
export class RenewalPaymentListener {
	@Inject() private readonly paymentService: PaymentService;

	@OnEvent(EEvent.RENEWAL_PAYMENT)
	public async execute(data: RenewalPaymentEvent) {
		await this.paymentService.create(data);
	}
}
