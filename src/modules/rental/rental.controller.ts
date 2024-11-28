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
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto, UpdateRentalDto } from './dto/rental.dto';
import { BaseResponse } from '../../utils/config/types';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  async create(
    @Body() createRentalDto: CreateRentalDto,
  ): Promise<BaseResponse> {
    const rental = await this.rentalService.create(createRentalDto);
    return { message: 'success', data: rental };
  }

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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BaseResponse> {
    const rental = await this.rentalService.findOne(id);
    return {
      message: 'success',
      data: rental,
    };
  }

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

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BaseResponse> {
    const rental = await this.rentalService.remove(id);
    return {
      message: 'success',
      data: rental,
    };
  }
}
