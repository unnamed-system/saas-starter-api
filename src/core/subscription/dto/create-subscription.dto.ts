import { EPaymentMethod } from '@domain/enums/EPaymentMethod';
import { ESubscriptionStatus } from '@domain/enums/ESubscriptionStatus';
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

	@IsNotEmpty()
	@IsEnum(EPaymentMethod)
	method: EPaymentMethod;

	@IsOptional()
	@IsEnum(ESubscriptionStatus)
	status: ESubscriptionStatus;

	@IsOptional()
	@IsDateString()
	startDate?: Date;

	@IsOptional()
	@IsDateString()
	endDate?: Date;
}
