import { CreateRentalDto, UpdateRentalDto } from './dto/rental.dto';
import { Rental } from '@prisma/client';

export interface IRentalService {
  /**
   * Create a new rental record
   * @param createRentalDto Data for creating a new rental
   * @returns The created rental record
   */
  create(createRentalDto: CreateRentalDto): Promise<Rental>;

  /**
   * Find all rental records with pagination and optional search
   * @param page Page number for pagination
   * @param limit Number of items per page
   * @param search Optional search string
   * @returns Object containing rentals, total count, page, and limit
   */
  findAll(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<{
    rentals: Rental[];
    total: number;
    page: number;
    limit: number;
  }>;

  /**
   * Find a single rental record by ID
   * @param id Unique identifier of the rental
   * @returns The found rental record or null
   */
  findOne(id: string): Promise<Rental | null>;

  /**
   * Update an existing rental record
   * @param id Unique identifier of the rental to update
   * @param updateRentalDto Data for updating the rental
   * @returns The updated rental record
   */
  update(id: string, updateRentalDto: UpdateRentalDto): Promise<Rental>;

  /**
   * Remove a rental record
   * @param id Unique identifier of the rental to remove
   * @returns Deletion result or confirmation message
   */
  remove(id: string): Promise<{ message: string }>;
}
