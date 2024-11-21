import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(75)
  firstName: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(75)
  lastName?: string;

  @IsString()
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class VerifyOtpDto {
  @IsNumber()
  @IsNotEmpty()
  otp: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
