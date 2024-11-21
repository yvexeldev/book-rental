import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseResponse, IUserService } from './user.interface';
import { I18nService } from 'nestjs-i18n';
import { SignInDto, SignUpDto, VerifyOtpDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../utils/redis/redis.service';
import { MailService } from '../../utils/mail/mail.service';
import * as crypto from 'node:crypto';
import { PrismaService } from '../../utils/prisma';
import { $Enums, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ } from '../../utils/config/constants';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly prismaService: PrismaService,
    private amqpConnection: AmqpConnection,
  ) {}

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
        isVerified: true,
      },
    });
    return user;
  }

  private async checkUser(email: string): Promise<void> {
    const user = await this.getUserByEmail(email);
    if (user) throw new BadRequestException(this.i18n.t('user.ALREADY_EXISTS'));
  }

  private async generateToken(
    userId: number,
    role: $Enums.Role,
  ): Promise<string> {
    const payload = {
      userId,
      role,
    };

    return await this.jwtService.signAsync(payload);
  }

  private async generateAndSaveOtp(email: string): Promise<string> {
    // otp generating
    const otp = String(crypto.randomInt(100000, 999999));

    // saving to redis
    await this.redisService.set(`otp:${email}`, otp, 180);
    Logger.log({ otp });
    return otp;
  }

  private async checkOtp(otp: number, email: string): Promise<boolean> {
    const redisOtp = await this.redisService.get(`otp:${email}`);
    return +redisOtp == otp;
  }

  private async verifyUser(id: number): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id,
        isVerified: false,
      },
      data: {
        isVerified: true,
      },
    });
  }

  async signUp(signUpDto: SignUpDto): Promise<BaseResponse> {
    await this.checkUser(signUpDto.email);

    const hashedPassword = await bcrypt.hash(signUpDto.password, 12);
    const user = await this.prismaService.user.create({
      data: { ...signUpDto, password: hashedPassword },
    });
    const otp = await this.generateAndSaveOtp(user.email);

    await this.amqpConnection.publish(
      RABBITMQ.EXCHANGES.EMAIL,
      RABBITMQ.ROUTING_KEYS.SEND_OTP,
      {
        email: user.email,
        otp: otp,
      },
    );

    return {
      message: this.i18n.t('user.EMAIL_SENT'),
      data: {
        user,
      },
    };

    // TODO:
    // 4 - Send it to user's mail (but with RabbitMQ Queueing)
  }

  async signIn(signInDto: SignInDto): Promise<BaseResponse> {
    const user = await this.getUserByEmail(signInDto.email);
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(
        signInDto.password,
        user.password,
      );
      if (isPasswordCorrect) {
        const token = await this.generateToken(user.id, user.role);
        return {
          message: this.i18n.t('user.LOGIN'),
          data: { token },
        };
      } else {
        throw new BadRequestException(this.i18n.t('user.PASSWORD_INCRORRECT'));
      }
    } else {
      throw new NotFoundException(this.i18n.t('user.NOT_FOUND'));
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<BaseResponse> {
    const condition = await this.checkOtp(verifyOtpDto.otp, verifyOtpDto.email);
    if (condition) {
      const user = await this.prismaService.user.findFirst({
        where: {
          email: verifyOtpDto.email,
          isVerified: false,
        },
      });

      await this.verifyUser(user.id);
      await this.prismaService.user.deleteMany({
        where: {
          email: verifyOtpDto.email,
          isVerified: false,
        },
      });

      const token = await this.generateToken(user.id, user.role);

      return {
        message: this.i18n.t('user.REGISTER'),
        data: { token },
      };
    } else {
      return {
        message: this.i18n.t('user.OTP_INCORRECT'),
        data: { verifyOtpDto },
      };
    }
  }
}
