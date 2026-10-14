import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MonedasModule } from './monedas/monedas.module.js';

@Module({
  imports: [MonedasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
