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
} from '@nestjs/common';
import { BookService } from './book.service';
import { BaseResponse } from '../../utils/config/interfaces';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Get()
  async getAllBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ): Promise<BaseResponse> {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 10;

    const books = await this.bookService.getAll(
      pageNumber,
      limitNumber,
      search,
    );
    return books;
  }

  @Get('/:id')
  async getBook(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse> {
    const book = await this.bookService.getOne(id);
    return {
      message: 'success',
      data: book,
    };
  }

  @Get('/isbn/:isbn')
  async getByISBN(@Param('isbn') isbn: string): Promise<BaseResponse> {
    const book = await this.bookService.getByISBN(isbn);
    return {
      message: 'success',
      data: book,
    };
  }

  @Post()
  async createBook(
    @Body() createBookDto: CreateBookDto,
  ): Promise<BaseResponse> {
    const book = await this.bookService.createBook(createBookDto);

    return {
      message: 'success',
      data: book,
    };
  }

  @Put('/:id')
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<BaseResponse> {
    const book = await this.bookService.updateBook(id, updateBookDto);
    return {
      message: 'success',
      data: book,
    };
  }

  @Delete('/:id')
  async deleteBook(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponse> {
    const book = await this.bookService.deleteBook(id);
    return {
      message: 'success',
      data: book,
    };
  }
}
