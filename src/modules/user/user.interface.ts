import { SignUpDto, SignInDto } from './dto/user.dto';
import { User } from '@prisma/client';
import { BaseResponse } from '../../utils/config/types';

export interface IUserService {
  /**
   * Handles user sign-up.
   *
   * @param signUpDto - The DTO containing user sign-up data.
   * @returns A promise that resolves to a base response with user information.
   */
  signUp(signUpDto: SignUpDto): Promise<BaseResponse>;

  /**
   * Handles user sign-in.
   *
   * @param signInDto - The DTO containing user sign-in data.
   * @returns A promise that resolves to a base response with a JWT token.
   */
  signIn(signInDto: SignInDto): Promise<BaseResponse>;

  /**
   * Retrieves a user by their email address.
   *
   * @param email - The user's email address.
   * @returns A promise that resolves to a user object or null if not found.
   */
  getUserByEmail(email: string): Promise<User | null>;

  /**
   * Retrieves a user by their email address.
   *
   * @param id - The user's email address.
   * @returns A promise that resolves to a user object or null if not found.
   */
  getUserById(id: number): Promise<User | BaseResponse>;
}
