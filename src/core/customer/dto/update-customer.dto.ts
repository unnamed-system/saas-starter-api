import { IsEmail, IsOptional, IsUUID } from 'class-validator';

export class UpdateCustomerDto {
	@IsOptional()
	fullname?: string;

	@IsOptional()
	document?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	password?: string;

	@IsOptional()
	@IsUUID('4')
	subscriptionId?: string;
}
