import { EPlanCycle } from '@domain/enums/EPlanCycle';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Plan } from './plan';

@Entity('plan_recurrences')
export class PlanRecurrence {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ name: 'plan_id', type: 'smallint' })
	planId: number;

	@Column({ type: 'enum', enum: EPlanCycle })
	cycle: EPlanCycle;

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	amount: number;

	@Column({ name: 'duration_in_days', type: 'smallint' })
	durationInDays: number;

	@Column({ type: 'bool', default: true })
	active: boolean;

	@CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
	createdAt: Date;

	// Relations
	@ManyToOne(() => Plan, (plan) => plan.recurrences, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'plan_id', referencedColumnName: 'id' })
	plan: Plan;
}
