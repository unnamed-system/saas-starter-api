import { Subscription } from '@domain/entities/subscription';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionListener {
	@InjectRepository(Subscription)
	private readonly repository: Repository<Subscription>;
}
