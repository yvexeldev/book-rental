import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailTransporter } from '../config/clients';

@Module({
  providers: [
    {
      provide: MailTransporter,
      useFactory: (configService: ConfigService) => {
        return nodemailer.createTransport({
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: configService.get<boolean>('SMTP_SECURE'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        });
      },
      inject: [ConfigService],
    },
    MailService,
  ],
  controllers: [],
  exports: [MailService],
})
export class MailModule {}
