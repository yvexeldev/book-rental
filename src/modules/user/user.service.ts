import { Injectable, Logger } from '@nestjs/common';
import { BaseResponse, IUserService } from './user.interface';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { SignUpDto } from './dto/user.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly i18n: I18nService) {}

  async signUp(signUpDto: SignUpDto): Promise<BaseResponse> {
    Logger.log(I18nContext.current().lang);
    // TODO: Change this
    return {
      message: this.i18n.t('test.HELLO', { lang: 'uz' }) + signUpDto.firstName,
      userId: 12,
    };
  }
}
