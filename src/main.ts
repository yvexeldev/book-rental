import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const PORT = config.get<number>('PORT');
  const HOST = config.get<string>('HOST');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new I18nValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  await app.listen(PORT, () => {
    Logger.log(`Server is running on http://${HOST}:${PORT}`);
  });
}
bootstrap();
