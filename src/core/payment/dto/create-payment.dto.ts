import { EPaymentMethod } from '@domain/enums/EPaymentMethod';
import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import {
	IsDateString,
	IsDecimal,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsUUID,
} from 'class-validator';

export class CreatePaymentDto {
	@IsNotEmpty()
	@IsUUID('4')
	subscriptionId: string;

	@IsNotEmpty()
	@IsEnum(EPaymentMethod)
	method: EPaymentMethod;

	@IsNumber()
	@IsDecimal()
	value: number;

	@IsNotEmpty()
	@IsEnum(EPaymentStatus)
	status: EPaymentStatus;

	@IsNotEmpty()
	@IsDateString()
	dueDate: Date;
}
