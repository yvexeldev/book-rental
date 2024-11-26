import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRentalDto, UpdateRentalDto } from './dto/rental.dto';
import { PrismaService } from '../../utils/prisma';
import { Prisma, Rental } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { IRentalService } from './rental.interface';

const include = {
  book: true,
  user: true,
};

@Injectable()
export class RentalService implements IRentalService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async create(createRentalDto: CreateRentalDto) {
    try {
      const rental = await this.prismaService.$transaction(async (prisma) => {
        const user = await prisma.user.findFirst({
          where: {
            id: createRentalDto.userId,
            isVerified: true,
          },
        });

        if (!user) {
          throw new NotFoundException(this.i18nService.t('user.NOT_FOUND'));
        }

        const book = await prisma.book.findFirst({
          where: { id: createRentalDto.bookId },
        });

        if (!book) {
          throw new NotFoundException(this.i18nService.t('book.NOT_FOUND'));
        }

        if (book.available_copies <= 0) {
          throw new BadRequestException(
            this.i18nService.t('book.NO_COPIES_AVAILABLE'),
          );
        }

        const newRental = await prisma.rental.create({
          data: {
            ...createRentalDto,
            givenDate: new Date(createRentalDto.givenDate),
          },
          include,
        });

        await prisma.book.update({
          where: { id: createRentalDto.bookId },
          data: { available_copies: book.available_copies - 1 },
        });

        return newRental;
      });

      return rental;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Rental creation failed');
      }
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    rentals: Rental[];
    total: number;
    page: number;
    limit: number;
  }> {
    page = Math.max(1, page);
    limit = Math.min(100, Math.max(1, limit));

    const where: Prisma.RentalWhereInput = search
      ? {
          OR: [
            { user: { firstName: { contains: search, mode: 'insensitive' } } },
            { book: { title: { contains: search, mode: 'insensitive' } } },
            { id: search },
          ],
        }
      : {};

    const [rentals, total] = await Promise.all([
      this.prismaService.rental.findMany({
        where,
        include,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.rental.count({ where }),
    ]);

    return {
      rentals,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const rental = await this.prismaService.rental.findFirst({
      include,
      where: { id },
    });

    return rental;
  }

  async update(id: string, updateRentalDto: UpdateRentalDto) {
    try {
      const rental = await this.prismaService.$transaction(async (prisma) => {
        // First, check if the rental exists
        const existingRental = await prisma.rental.findUnique({
          where: { id },
          include: { book: true },
        });

        if (!existingRental) {
          throw new NotFoundException(this.i18nService.t('rental.NOT_FOUND'));
        }

        // If userId is being updated, verify the new user
        if (updateRentalDto.userId) {
          const user = await prisma.user.findFirst({
            where: {
              id: updateRentalDto.userId,
              isVerified: true,
            },
          });

          if (!user) {
            throw new NotFoundException(this.i18nService.t('user.NOT_FOUND'));
          }
        }

        // If bookId is being updated, handle book availability
        if (
          updateRentalDto.bookId &&
          updateRentalDto.bookId !== existingRental.bookId
        ) {
          const newBook = await prisma.book.findFirst({
            where: { id: updateRentalDto.bookId },
          });

          if (!newBook) {
            throw new NotFoundException(this.i18nService.t('book.NOT_FOUND'));
          }

          if (newBook.available_copies <= 0) {
            throw new BadRequestException(
              this.i18nService.t('book.NO_COPIES_AVAILABLE'),
            );
          }

          // Update book copies
          await prisma.book.update({
            where: { id: existingRental.bookId },
            data: {
              available_copies: existingRental.book.available_copies + 1,
            },
          });

          await prisma.book.update({
            where: { id: updateRentalDto.bookId },
            data: { available_copies: newBook.available_copies - 1 },
          });
        }

        // Perform the update
        const updatedRental = await prisma.rental.update({
          where: { id },
          data: {
            ...(updateRentalDto.userId && { userId: updateRentalDto.userId }),
            ...(updateRentalDto.bookId && { bookId: updateRentalDto.bookId }),
            ...(updateRentalDto.givenDate && {
              givenDate: new Date(updateRentalDto.givenDate),
            }),
            ...(updateRentalDto.returnedDate && {
              returnedDate: new Date(updateRentalDto.returnedDate),
            }),
          },
          include,
        });

        return updatedRental;
      });

      return rental;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(
          this.i18nService.t('rental.UPDATE_FAILED'),
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const rental = await this.prismaService.$transaction(async (prisma) => {
        // Find the rental first to check its existence and get associated book
        const existingRental = await prisma.rental.findUnique({
          where: { id },
          include: { book: true },
        });

        if (!existingRental) {
          throw new NotFoundException(this.i18nService.t('rental.NOT_FOUND'));
        }

        // If the book is already returned, proceed with deletion
        if (existingRental.returnedDate) {
          // Delete the rental
          await prisma.rental.delete({
            where: { id },
          });

          return {
            message: this.i18nService.t('rental.DELETED_SUCCESSFULLY'),
            data: {},
          };
        }

        // If the book is not returned, update book availability and then delete
        await prisma.book.update({
          where: { id: existingRental.bookId },
          data: {
            available_copies: existingRental.book.available_copies + 1,
          },
        });

        // Delete the rental
        await prisma.rental.delete({
          where: { id },
        });

        return { message: this.i18nService.t('rental.DELETED_SUCCESSFULLY') };
      });

      return rental;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(
          this.i18nService.t('rental.DELETE_FAILED'),
        );
      }
      throw error;
    }
  }
}
