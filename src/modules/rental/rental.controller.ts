import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto, UpdateRentalDto } from './dto/rental.dto';
import { BaseResponse, UserEntity } from '../../utils/config/types';
import { UserGuard } from 'src/utils/guard/user.guard';
import { AdminGuard } from 'src/utils/guard/admin.guard';
import { User } from 'src/utils/decorators/get-user';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @UseGuards(UserGuard)
  @Post()
  async create(
    @Body() createRentalDto: CreateRentalDto,
  ): Promise<BaseResponse> {
    const rental = await this.rentalService.create(createRentalDto);
    return { message: 'success', data: rental };
  }

  @UseGuards(AdminGuard)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<BaseResponse> {
    const rentals = await this.rentalService.findAll(page, limit, search);
    return {
      message: 'success',
      data: rentals,
    };
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BaseResponse> {
    const rental = await this.rentalService.findOne(id);
    return {
      message: 'success',
      data: rental,
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRentalDto: UpdateRentalDto,
  ): Promise<BaseResponse> {
    const rental = await this.rentalService.update(id, updateRentalDto);
    return {
      message: 'success',
      data: rental,
    };
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BaseResponse> {
    const rental = await this.rentalService.remove(id);
    return {
      message: 'success',
      data: rental,
    };
  }

  @UseGuards(UserGuard)
  @Put('/returnRent/:id')
  async returnRental(
    @Param('id') id: string,
    @User() user: UserEntity,
  ): Promise<BaseResponse> {
    const updatedRental = await this.rentalService.returnRental(id, user.id);
    return {
      message: 'success',
      data: updatedRental,
    };
  }
}
