import { ESubscriptionStatus } from '@domain/enums/ESubscriptionStatus';
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

	@Column({ type: 'bool', default: true })
	renewal: boolean;

	@Column({ name: 'start_at', type: 'timestamptz', default: new Date() })
	startAt: Date;

	@Column({ name: 'end_at', type: 'timestamptz', nullable: true })
	endAt?: Date;

	@Column({ name: 'canceled_at', type: 'timestamptz', nullable: true })
	canceledAt?: Date;

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
	@JoinColumn({ name: 'plan_id', referencedColumnName: 'id' })
	plan: Plan;
}
