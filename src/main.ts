import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const PORT = config.get<number>('PORT');
  const HOST = config.get<string>('HOST');

  await app.listen(PORT, () => {
    Logger.log(`Server is running on ${HOST}:${PORT}`);
  });
}
bootstrap();
