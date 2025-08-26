import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerDto {
	@IsNotEmpty()
	fullname: string;

	@IsOptional()
	googleId?: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsOptional()
	document?: string;

	@IsOptional()
	password?: string;
}
