export enum EPaymentStatus {
	PENDING = 'PENDING', // Pagamento emitido, ainda não pago
	CONFIRMED = 'CONFIRMED', // Pagamento confirmado pelo Asaas
	OVERDUE = 'OVERDUE', // Pagamento atrasado
	REFUNDED = 'REFUNDED', // Pagamento estornado
	CANCELED = 'CANCELED', // Pagamento cancelado antes de ser confirmado
	FAILED = 'FAILED', // Tentativa de pagamento falhou
}
