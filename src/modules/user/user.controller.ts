import { Body, Controller, Get } from '@nestjs/common';

import { UserService } from './user.service';
import { BaseResponse } from './user.interface';
import { SignUpDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async registerUser(@Body() signUpDto: SignUpDto): Promise<BaseResponse> {
    return await this.userService.signUp(signUpDto);
  }
}
