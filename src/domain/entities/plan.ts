import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { PlanRecurrence } from './plan-recurrence';
import { Subscription } from './subscription';

@Entity('plans')
export class Plan {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ length: 32 })
	name: string;

	@Column({ type: 'jsonb', nullable: true })
	benefits?: string[];

	@Column({ type: 'bool', default: true })
	active: boolean;

	@CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
	createdAt: Date;

	// Relations
	@OneToMany(() => Subscription, (subscription) => subscription.plan)
	subscriptions: Subscription[];

	@OneToMany(() => PlanRecurrence, (recurrence) => recurrence.plan)
	recurrences: PlanRecurrence[];
}
