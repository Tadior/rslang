import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

const PORT = process.env.PORT || 4444;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'src', 'files'), {
    prefix: '/files',
  });
  app.enableCors();
  await app.listen(PORT, () => {
    console.log(`Start server on the ${PORT} port!`);
  });
}
bootstrap();
