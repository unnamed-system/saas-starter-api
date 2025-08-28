import { IsInt, IsNotEmpty } from 'class-validator';

export class ChangePlanDto {
	@IsNotEmpty()
	@IsInt()
	planId: number;
}
