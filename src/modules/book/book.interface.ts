import { BaseResponse } from '../../utils/config/types';
import { Book } from '@prisma/client';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

export interface IBookService {
  getAll(page?: number, limit?: number, search?: string): Promise<BaseResponse>;
  getByISBN(isbn: string): Promise<Book | null>;
  getOne(id: number): Promise<Book>;
  createBook(createBookDto: CreateBookDto): Promise<Book>;
  updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book>;
  deleteBook(id: number): Promise<Book>;
}
