import { EEvent } from '@domain/enums/EEvent';
import { EPaymentMethod } from '@domain/enums/EPaymentMethod';

export class SubscriptionAuthorizedEvent {
	id: string;
	event: EEvent.SUBSCRIPTION_AUTHORIZED;
	payment: {
		value: number;
		status: string;
		billingType: EPaymentMethod;
	};
}
