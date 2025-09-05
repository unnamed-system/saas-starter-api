export enum EEvent {
	SUBSCRIPTION_AUTHORIZED = 'subscription.authorized',
	SUBSCRIPTION_EXPIRATION = 'subscription.expiration',
	SUBSCRIPTION_RENEWAL = 'subscription.renewal',

	PAYMENT_RECEIVED = 'payment.received',
	PAYMENT_REFUNDED = 'payment.refunded',
	PAYMENT_CONFIRMED = 'payment.confirmed',
	RENEWAL_PAYMENT = 'renewal.payment',
}
