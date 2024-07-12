import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  
  const port = process.env.PHONE_BOOK_PORT || 3000;
  await app.listen(port);
}
bootstrap().catch((error) => {
  console.log('Error caught on starting main:', error);
});
