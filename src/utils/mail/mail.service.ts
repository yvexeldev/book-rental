import { Inject, Injectable } from '@nestjs/common';

import { Transporter } from 'nodemailer';
import { MailTransporter } from '../config/clients';
import { IMailService } from './mail.interface';

@Injectable()
export class MailService implements IMailService {
  constructor(
    @Inject(MailTransporter) private readonly transporter: Transporter,
  ) {}

  async sendOtp(to: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.GOOGLE_SMPT_USERNAME,
      to,
      subject: 'Your OTP Code',
      html: `<b>Your OTP code is: ${otp}</b>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
