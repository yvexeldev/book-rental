import { SignUpDto } from './dto/user.dto';

export type BaseResponse = {
  message: string;
  userId: number;
};

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export interface IUserService {
  signUp(signUpDto: SignUpDto): Promise<BaseResponse>;
}

export interface IAuthService {
  generateToken(userId: number, role: Role): Promise<string>;
}
