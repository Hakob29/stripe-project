import { ValidationPipe } from '@nestjs/common';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './execptions/All-Execptions.filter';
import * as Sentry from '@sentry/node';
import { Telegraf, Context } from 'telegraf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  let  bot: Telegraf<Context>
  const { httpAdapter }: any = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, bot));
  Sentry.init({
    dsn: 'https://6469195516294e6781aac31b03d2c65c@o1300011.ingest.sentry.io/6533943',
  });
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
