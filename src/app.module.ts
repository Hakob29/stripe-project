import { Module, CacheModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './entity';
import { StripeModule } from 'nestjs-stripe';
import { ProductsModule } from './products/products.module';
import { StripeModule as StripeModuleNew } from './stripe/stripe.module';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegrafModule } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';


@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'sammy',
      password: 'Password78@',
      database: 'stripeproject',
      entities: entities,
      synchronize: true,
    }),

    StripeModule.forRoot({
      apiKey:
        'sk_test_51L3E5LFQvqyh9kr8a8TtmRd3XrHPpzK5FdiMOWax9sJwp3TW5ks8JLpnTWeJVH4XL4gcF9NprRqSZ7DAlDDq6PvZ00ut7qB3UL',
      apiVersion: '2020-08-27',
    }),
    TelegrafModule.forRoot({
      token: '5566025218:AAHEaXRmgp1rzJV0wTISc6usRW7fq9cuH6U',
    }),
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    ProductsModule,
    StripeModuleNew,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [Telegraf],
})
export class AppModule {}
