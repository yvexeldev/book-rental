import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserService } from './user.service.interface';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async signUp(): Promise<{ message: string; userId: number }> {
    Logger.log(I18nContext.current().lang);
    // TODO: Change this
    return {
      message: this.i18n.t('test.HELLO', { lang: 'uz' }),
      userId: 12,
    };
  }
}
