import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateRentalDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.VALIDATION_USER_ID_REQUIRED'),
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.VALIDATION_USER_ID_REQUIRED'),
    },
  )
  userId: number;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.VALIDATION_BOOK_ID_REQUIRED'),
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.VALIDATION_BOOK_ID_REQUIRED'),
    },
  )
  bookId: number;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.VALIDATION_DATE_STRING'),
  })
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.VALIDATION_DATE_STRING') },
  )
  givenDate: Date;
}

export class UpdateRentalDto {
  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.VALIDATION_USER_ID_REQUIRED'),
    },
  )
  userId?: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.VALIDATION_BOOK_ID_REQUIRED'),
    },
  )
  bookId?: number;

  @IsOptional()
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.VALIDATION_DATE_STRING') },
  )
  givenDate?: Date;

  @IsOptional()
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.VALIDATION_DATE_STRING') },
  )
  returnedDate?: Date;
}
