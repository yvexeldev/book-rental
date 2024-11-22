import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { BaseResponse } from './user.interface';
import {
  SetUsernameDto,
  SignInDto,
  SignUpDto,
  UpdateUserDto,
  VerifyOtpDto,
} from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('users')
  async getAllUsers(
    @Query('isVerified', ParseBoolPipe) isVerified?: boolean,
  ): Promise<BaseResponse> {
    return await this.userService.getAllusers(isVerified);
  }

  @Delete('unverified')
  async deleteUnverifiedUsers() {
    return await this.userService.deleteUnverifiedUsers();
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<BaseResponse> {
    return await this.userService.signUp(signUpDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<BaseResponse> {
    return await this.userService.signIn(signInDto);
  }

  @Post('verifyOtp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<BaseResponse> {
    return await this.userService.verifyOtp(verifyOtpDto);
  }

  @Get('/:id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponse> {
    const user = await this.userService.getUserById(id);
    return {
      message: 'success',
      data: { user },
    };
  }

  @Get('/email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<BaseResponse> {
    const user = await this.userService.getUserByEmail(email);
    return {
      message: 'success',
      data: { user },
    };
  }

  @Put('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BaseResponse> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Put('/username/:id')
  async setUsername(
    @Param('id', ParseIntPipe) id: number,
    @Body() setUserNameDto: SetUsernameDto,
  ) {
    return await this.userService.setUsername(id, setUserNameDto);
  }
}
