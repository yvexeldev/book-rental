import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';

import {
    SetUsernameDto,
    SignInDto,
    SignUpDto,
    UpdateUserDto,
    VerifyOtpDto,
} from './dto/user.dto';
import { BaseResponse, UserEntity } from '../../utils/config/types';
import { UserGuard } from 'src/utils/guard/user.guard';
import { User } from 'src/utils/decorators/get-user';
import { SuperAdminGuard } from 'src/utils/guard/super-admin.guard';
import { AdminGuard } from 'src/utils/guard/admin.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(SuperAdminGuard)
    @Get('users')
    async getAllUsers(
        @Query('isVerified') isVerified?: string,
    ): Promise<BaseResponse> {
        return await this.userService.getAllusers(isVerified);
    }

    @UseGuards(AdminGuard)
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

    @UseGuards(UserGuard)
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

    @UseGuards(AdminGuard)
    @Get('/email/:email')
    async getUserByEmail(@Param('email') email: string): Promise<BaseResponse> {
        const user = await this.userService.getUserByEmail(email);
        return {
            message: 'success',
            data: { user },
        };
    }

    @UseGuards(UserGuard)
    @Put('/:id')
    async updateUser(
        @User() user: UserEntity,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<BaseResponse> {
        return await this.userService.updateUser(user.id, updateUserDto);
    }

    @UseGuards(UserGuard)
    @Put('/username/:id')
    async setUsername(
        @User() user: UserEntity,
        @Body() setUserNameDto: SetUsernameDto,
    ) {
        return await this.userService.setUsername(user.id, setUserNameDto);
    }
}
