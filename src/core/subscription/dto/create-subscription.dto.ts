import { EPaymentMethod } from '@domain/enums/EPaymentMethod';
import { ESubscriptionStatus } from '@domain/enums/ESubscriptionStatus';
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
} from 'class-validator';
export class CreateSubscriptionDto {
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
	startAt?: Date;

	@IsOptional()
	@IsDateString()
	endAt?: Date;
}
