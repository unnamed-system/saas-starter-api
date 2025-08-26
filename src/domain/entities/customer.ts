import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Subscription } from './subscription';

@Entity('customers')
export class Customer {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'google_id', nullable: true, unique: true })
	googleId?: string;

	@Column()
	fullname: string;

	@Column({ length: 24, nullable: true, unique: true })
	document?: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	password?: string;

	@Column({ name: 'subscription_id', type: 'uuid', nullable: true })
	subscriptionId?: string;

	@Column({ name: 'trial_used', type: 'bool', default: false })
	trialUsed: boolean;

	@CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
	updatedAt: Date;

	@UpdateDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
	deletedAt?: Date;

	// Relations
	@OneToMany(() => Subscription, (subscription) => subscription.customer)
	subscriptions: Subscription[];
}
