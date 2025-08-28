import { EPaymentMethod } from '@domain/enums/EPaymentMethod';
import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import {
	IsDateString,
	IsDecimal,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsUUID,
} from 'class-validator';

export class CreatePaymentDto {
	@IsNotEmpty()
	@IsUUID('4')
	subscriptionId: string;

	@IsNotEmpty()
	@IsEnum(EPaymentMethod)
	method: EPaymentMethod;

	@IsDecimal()
	value: number;

	@IsOptional()
	@IsDecimal()
	discount?: number;

	@IsNotEmpty()
	@IsEnum(EPaymentStatus)
	status: EPaymentStatus;

	@IsNotEmpty()
	@IsDateString()
	dueAt: Date;

	@IsOptional()
	notes?: string;
}
