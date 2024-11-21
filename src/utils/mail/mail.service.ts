import { Inject, Injectable } from '@nestjs/common';

// import { MailTransporter } from './mail.module';
import { Transporter } from 'nodemailer';
import { MailTransporter } from '../config/clients';

@Injectable()
export class MailService {
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
