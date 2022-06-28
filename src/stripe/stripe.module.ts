import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeController } from './controller/stripe.controller';
import { StripeService } from './service/stripe.service';
import entities from '../entity/index';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './service/cron.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../execptions/model/execptions-model';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [StripeController],
  providers: [
    StripeService,
    CronService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class StripeModule {}
