import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer';
import { Payment } from './payment';
import { Plan } from './plan';

export enum ESubscriptionStatus {
	ACTIVE = 'active',
	CANCELED = 'canceled',
	EXPIRED = 'expired',
	PAST_DUE = 'past_due',
}

@Entity('subscriptions')
export class Subscription {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'customer_id' })
	customerId: string;

	@Column({ name: 'plan_id' })
	planId: number;

	@Column({
		type: 'enum',
		enum: ESubscriptionStatus,
		default: ESubscriptionStatus.ACTIVE,
	})
	status: ESubscriptionStatus;

	@Column({
		type: 'timestamptz',
		name: 'start_date',
		default: new Date(),
	})
	startDate: Date;

	@Column({ type: 'timestamptz', name: 'end_date', nullable: true })
	endDate?: Date;

	@Column({ name: 'external_id', nullable: true })
	externalId?: string;

	@OneToMany(() => Payment, (payment) => payment.subscription)
	payments: Payment[];

	@CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
	updatedAt: Date;

	// Relations
	@ManyToOne(() => Customer, (customer) => customer.subscriptions)
	@JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
	customer: Customer;

	@ManyToOne(() => Plan, (plan) => plan.subscriptions)
	plan: Plan;
}
