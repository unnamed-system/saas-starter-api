import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
	@Inject() private readonly customerService: CustomerService;

	@Get()
	public find() {
		return this.customerService.find();
	}

	@Post()
	public create(@Body() data: CreateCustomerDto) {
		return this.customerService.create(data);
	}
}
