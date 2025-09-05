import { EEvent } from '@domain/enums/EEvent';
import { EPaymentMethod } from '@domain/enums/EPaymentMethod';

export class PaymentConfirmedEvent {
	event: EEvent.PAYMENT_CONFIRMED;
	value: number;
	status: string;
	billingType: EPaymentMethod;
}
