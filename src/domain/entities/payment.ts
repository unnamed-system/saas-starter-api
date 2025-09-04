import { EPaymentMethod } from '@domain/enums/EPaymentMethod';
import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import { EPaymentType } from '@domain/enums/EPaymentType';
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

	@Column({ type: 'enum', enum: EPaymentType })
	type: EPaymentType;

	@Column({ name: 'subscription_id', nullable: true })
	subscriptionId?: string;

	@Column({ name: 'external_id', nullable: true })
	externalId?: string;

	@Column({
		type: 'enum',
		enum: EPaymentMethod,
	})
	method: EPaymentMethod;

	@Column({ name: 'due_at', nullable: true, type: 'timestamptz' })
	dueAt?: Date;

	@Column({ name: 'paid_at', nullable: true, type: 'timestamptz' })
	paidAt?: Date;

	@Column({ name: 'refunded_at', nullable: true, type: 'timestamptz' })
	refundedAt?: Date;

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	amount: number;

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	discount: number;

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
