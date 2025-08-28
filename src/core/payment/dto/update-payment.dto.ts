import { EPaymentStatus } from '@domain/enums/EPaymentStatus';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdatePaymentDto {
	@IsOptional()
	status?: EPaymentStatus;

	@IsOptional()
	@IsDateString()
	refundedAt?: Date;

	@IsOptional()
	notes?: string;
}
