import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { MailService } from './mail.service';
import { RABBITMQ } from '../config/constants';

@Injectable()
export class MailConsumerService {
  private readonly logger = new Logger(MailConsumerService.name);

  constructor(private mailService: MailService) {}

  @RabbitSubscribe({
    exchange: RABBITMQ.EXCHANGES.EMAIL,
    routingKey: RABBITMQ.ROUTING_KEYS.SEND_OTP,
    queue: RABBITMQ.QUEUES.SEND_OTP,
  })
  async handleSendOtpTask(message: { email: string; otp: string }) {
    try {
      await this.mailService.sendOtp(message.email, message.otp);
      this.logger.log(`OTP sent to ${message.email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${message.email}`, error);
    }
  }
}
