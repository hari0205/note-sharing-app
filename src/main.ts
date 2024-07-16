import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllHttpExceptionsFilter } from './global-exception-filters/all-exceptions.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'log', 'verbose'],
  });

  app.useGlobalFilters(new AllHttpExceptionsFilter());
  app.setGlobalPrefix('/api/v1');
  app.use(cookieParser());
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
bootstrap();
