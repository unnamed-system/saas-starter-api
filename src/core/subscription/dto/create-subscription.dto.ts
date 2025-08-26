import { EPaymentMethod } from '@domain/enums/EPaymentMethod';
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsUUID,
} from 'class-validator';
export class CreateSubscriptionDto {
	@IsNotEmpty()
	@IsUUID('4')
	customerId: string;

	@IsNotEmpty()
	@IsInt()
	planId: number;

	@IsOptional()
	@IsDateString()
	startDate?: Date;

	@IsNotEmpty()
	@IsEnum(EPaymentMethod)
	method: EPaymentMethod;

	@IsOptional()
	@IsDateString()
	endDate?: Date;
}
