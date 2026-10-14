import { Controller, Get, Query } from '@nestjs/common';
import { MonedasService } from './monedas.service.js';

@Controller('monedas')
export class MonedasController {
	constructor(private readonly monedasService: MonedasService) {}

	@Get()
	findAll(@Query('q') q?: string) {
		return this.monedasService.findAll(q);
	}
}
