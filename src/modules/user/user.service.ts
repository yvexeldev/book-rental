import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IUserService } from './user.interface';
import { I18nService } from 'nestjs-i18n';
import {
  SetUsernameDto,
  SignInDto,
  SignUpDto,
  UpdateUserDto,
  VerifyOtpDto,
} from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../utils/redis/redis.service';
import * as crypto from 'node:crypto';
import { PrismaService } from '../../utils/prisma';
import { $Enums, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ } from '../../utils/config/constants';
import { BaseResponse } from '../../utils/config/interfaces';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
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

  async signUp(signUpDto: SignUpDto): Promise<BaseResponse> {
    return this.prismaService.$transaction(async (prisma) => {
      await this.checkUser(signUpDto.email);

      const hashedPassword = await bcrypt.hash(signUpDto.password, 12);
      const user = await prisma.user.create({
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
        data: user,
      };
    });
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
        throw new BadRequestException(this.i18n.t('user.PASSWORD_INCORRECT'));
      }
    } else {
      throw new NotFoundException(this.i18n.t('user.NOT_FOUND'));
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<BaseResponse> {
    return this.prismaService.$transaction(async (prisma) => {
      const condition = await this.checkOtp(
        verifyOtpDto.otp,
        verifyOtpDto.email,
      );
      if (condition) {
        const user = await prisma.user.findFirst({
          where: {
            email: verifyOtpDto.email,
            isVerified: false,
          },
        });
        if (!user) {
          throw new BadRequestException(this.i18n.t('user.ALREADY_EXISTS'));
        }
        await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true },
        });
        await prisma.user.deleteMany({
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
        throw new ForbiddenException(this.i18n.t('user.OTP_INCORRECT'));
      }
    });
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: { id, isVerified: true },
    });

    if (!user) {
      throw new NotFoundException(this.i18n.t('user.NOT_FOUND'));
    }
    return user;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<BaseResponse> {
    return this.prismaService.$transaction(async (prisma) => {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      const isExists = await prisma.user.findFirst({
        where: { id, isVerified: true },
      });
      Logger.log({ isExists });
      if (isExists) {
        const user = await prisma.user.update({
          where: { id },
          data: updateUserDto,
        });

        Logger.log({ user, updateUserDto });

        return {
          message: this.i18n.t('user.UPDATE'),
          data: { updatedUser: user },
        };
      } else {
        throw new NotFoundException(this.i18n.t('user.NOT_FOUND'));
      }
    });
  }

  async setUsername(
    id: number,
    setUsernameDto: SetUsernameDto,
  ): Promise<BaseResponse> {
    const user = await this.prismaService.user.findFirst({
      where: { id, isVerified: true },
    });
    if (!user) {
      throw new NotFoundException(this.i18n.t('user.NOT_FOUND'));
    }
    const isExists = await this.prismaService.user.findFirst({
      where: { username: setUsernameDto.username },
    });
    if (isExists) {
      throw new BadRequestException(this.i18n.t('user.ALREADY_EXISTS'));
    }
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: { username: setUsernameDto.username },
    });

    Logger.log({ setUsernameDto });

    return {
      message: this.i18n.t('user.UPDATE'),
      data: { updatedUser: user },
    };
  }

  async getAllusers(isVerified: boolean): Promise<BaseResponse> {
    const users = await this.prismaService.user.findMany({
      where: { isVerified: isVerified },
    });

    return {
      message: 'success',
      data: { users },
    };
  }

  async deleteUnverifiedUsers(): Promise<BaseResponse> {
    const users = await this.prismaService.user.deleteMany({
      where: {
        isVerified: false,
      },
    });

    return {
      message: 'success',
      data: { users },
    };
  }
}
