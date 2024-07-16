import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllHttpExceptionsFilter } from './global-exception-filters/all-exceptions.filter';
import * as cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';



async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'log', 'verbose'],
  });

  app.useGlobalFilters(new AllHttpExceptionsFilter());
  app.setGlobalPrefix('/api/v1');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
bootstrap();
