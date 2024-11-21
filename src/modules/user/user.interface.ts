import { SignUpDto, SignInDto, VerifyOtpDto } from './dto/user.dto';

export type BaseResponse = {
  message: string;
  data: object;
};

export interface IUserService {
  signUp(signUpDto: SignUpDto): Promise<BaseResponse>;
  signIn(signInDto: SignInDto): Promise<BaseResponse>;
  verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<BaseResponse>;
}
