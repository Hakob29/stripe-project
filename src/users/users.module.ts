import { CacheModule, Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import * as redisStore from 'cache-manager-redis-store';
import { UsersService } from './service/users.service';
import type { ClientOpts } from 'redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../execptions/All-Execptions.filter';
import { TelegrafModule } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';


@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    TelegrafModule.forRoot({
      token: '5566025218:AAHEaXRmgp1rzJV0wTISc6usRW7fq9cuH6U',
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    Telegraf
  ],
})
export class UsersModule {}
