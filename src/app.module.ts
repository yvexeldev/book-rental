import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndexModule } from './modules';
import { ConfigSchema } from './utils/config';
import * as path from 'path';

import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';

import { UtilsModule } from './utils/utils.module';
@Module({
  imports: [
    IndexModule,

    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigSchema,
    }),

    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('I18N_FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: path.join(__dirname, '.././i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),

    UtilsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
