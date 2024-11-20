import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IndexModule } from './modules';
import { ConfigSchema } from './utils/config';

@Module({
  imports: [
    IndexModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigSchema,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
