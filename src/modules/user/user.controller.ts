import { Controller, Get } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async registerUser(): Promise<{
    message: string;
    userId: number;
  }> {
    return await this.userService.signUp();
  }
}
