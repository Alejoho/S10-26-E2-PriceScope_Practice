import { Module } from '@nestjs/common';
import { MonedasController } from './monedas.controller.js';
import { MonedasService } from './monedas.service.js';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MonedasController],
  providers: [MonedasService]
})
export class MonedasModule {}
