import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../utils/prisma';
import { BaseResponse } from '../../utils/config/interfaces';
import { I18nService } from 'nestjs-i18n';
import { Book } from '@prisma/client';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

const include = {
  rentals: {
    include: {
      user: true,
    },
  },
};

@Injectable()
export class BookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async getAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<BaseResponse> {
    const skip = (page - 1) * limit;
    const take = limit;

    const books = await this.prismaService.book.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { author: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      skip,
      take,
      include,
    });

    const totalCount = await this.prismaService.book.count({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { author: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      message: 'success',
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
        },
      },
    };
  }

  async getByISBN(isbn: string): Promise<Book | null> {
    const book = await this.prismaService.book.findFirst({
      where: {
        isbn,
      },
      include,
    });
    if (!book) throw new NotFoundException(this.i18n.t('book.NOT_FOUND'));
    return book;
  }

  async getOne(id: number): Promise<Book> {
    const book = await this.prismaService.book.findUnique({
      where: { id },
      include,
    });
    if (!book) {
      throw new NotFoundException(this.i18n.t('book.NOT_FOUND'));
    }
    return book;
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const isExists = await this.getByISBN(createBookDto.isbn);
    if (isExists) {
      throw new BadRequestException(this.i18n.t('book.ISBN_ALREADY_EXISTS'));
    }
    const book = await this.prismaService.book.create({
      data: createBookDto,
      include,
    });

    return book;
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.getOne(id);
    const byISBN = await this.getByISBN(updateBookDto.isbn);
    if (byISBN) {
      throw new BadRequestException(this.i18n.t('book.ISBN_ALREADY_EXISTS'));
    }
    const newBook = await this.prismaService.book.update({
      where: {
        id: book.id,
      },
      data: updateBookDto,
      include,
    });

    return newBook;
  }

  async deleteBook(id: number): Promise<Book> {
    const isExists = await this.getOne(id);
    if (!isExists) {
      throw new NotFoundException(this.i18n.t('book.NOT_FOUND'));
    }

    const isDeleted = await this.prismaService.book.delete({
      where: { id },
      include,
    });
    return isDeleted;
  }
}
