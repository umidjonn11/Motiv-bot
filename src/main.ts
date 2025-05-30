import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe (optional but recommended)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // You don't need to start the bot manually if using nestjs-grammy correctly
  await app.listen(3000);
  Logger.log(`🚀 Application is running on: http://localhost:3000`);
}
bootstrap();
