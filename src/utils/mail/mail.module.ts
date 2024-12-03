import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailTransporter, RABBITMQ } from '../config/constants';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MailConsumerService } from './mail.consumer';

@Global()
@Module({
    imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            useFactory: (configService: ConfigService) => ({
                exchanges: [
                    {
                        name: RABBITMQ.EXCHANGES.EMAIL,
                        type: 'direct',
                    },
                ],
                uri: configService.get<string>('RABBITMQ_URI'),
            }),
            inject: [ConfigService],
        }),
    ],
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
        MailConsumerService,
    ],
    controllers: [],
    exports: [MailService, MailConsumerService],
})
export class MailModule {}
