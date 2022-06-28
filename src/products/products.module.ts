import { Module } from '@nestjs/common';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './service/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entity/products-entity';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../execptions/model/execptions-model';
import { Telegraf } from 'telegraf';
import { TelegrafModule } from 'nestjs-telegraf';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TelegrafModule.forRoot({
      token: '5566025218:AAHEaXRmgp1rzJV0wTISc6usRW7fq9cuH6U',
    }),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    Telegraf,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class ProductsModule {}
