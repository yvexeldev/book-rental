import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService, Role } from './user.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly jwtService: JwtService) {}
  async generateToken(userId: number, role: Role): Promise<string> {
    const payload = {
      userId,
      role,
    };

    return await this.jwtService.signAsync(payload);
  }
}
