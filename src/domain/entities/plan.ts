import { EPlanCycle } from '@domain/enums/EPlanCycle';
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Subscription } from './subscription';

@Entity('plans')
export class Plan {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ length: 32 })
	name: string;

	@Column({ type: 'jsonb', nullable: true })
	details?: string[];

	@Column({ type: 'enum', enum: EPlanCycle })
	cycle: EPlanCycle;

	@Column({ type: 'decimal' })
	amount: number;

	@Column({ type: 'bool', default: true })
	active: boolean;

	@CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
	createdAt: Date;

	// Relations
	@OneToMany(() => Subscription, (subscription) => subscription.plan)
	subscriptions: Subscription[];
}
