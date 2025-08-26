import { EPlanCycle } from '@domain/enums/EPlanCycle';
import {
	IsArray,
	IsDecimal,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	MaxLength,
} from 'class-validator';

export class CreatePlanDto {
	@IsNotEmpty()
	@MaxLength(32)
	name: string;

	@IsNotEmpty()
	@IsArray({ each: true })
	details: string[];

	@IsNotEmpty()
	@IsEnum(EPlanCycle)
	cycle: EPlanCycle;

	@IsNotEmpty()
	@IsNumber()
	@IsDecimal()
	amount: number;
}
