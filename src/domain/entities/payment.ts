import { EPaymentMethod } from '@domain/enums/EPaymentMethod';
import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Subscription } from './subscription';

@Entity('payments')
export class Payment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'subscription_id', nullable: true })
	subscriptionId?: string;

	@Column({ name: 'external_id', nullable: true })
	externalId?: string;

	@Column({
		type: 'enum',
		enum: EPaymentMethod,
	})
	method: EPaymentMethod;

	@Column({ name: 'due_date', nullable: true, type: 'timestamptz' })
	dueDate?: Date;

	@Column({ name: 'payment_date', nullable: true, type: 'timestamptz' })
	paymentDate?: Date;

	@Column({ type: 'decimal' })
	value: number;

	@Column({
		type: 'enum',
		enum: EPaymentStatus,
		default: EPaymentStatus.PENDING,
	})
	status: EPaymentStatus;

	@Column('jsonb', { nullable: true })
	payload?: Record<string, any>;

	@Column({ nullable: true })
	notes?: string;

	@CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
	updatedAt: Date;

	// Relations

	@ManyToOne(() => Subscription, (subscription) => subscription.payments)
	@JoinColumn({ name: 'subscription_id', referencedColumnName: 'id' })
	subscription: Subscription;
}
