import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('webhook_logs')
export class WebhookLog {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'event_type' })
	eventType: string;

	@Column('jsonb')
	payload: Record<string, any>;

	@Column({ default: false })
	processed: boolean;

	@Column({ nullable: true })
	error?: string;

	@CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
	createdAt: Date;
}
