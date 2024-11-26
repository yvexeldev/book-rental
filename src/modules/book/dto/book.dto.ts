import {
  IsString,
  IsInt,
  Min,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateBookDto {
  @IsString({
    message: i18nValidationMessage('validation.VALIDATION_TITLE_STRING'),
  })
  @IsNotEmpty()
  @MinLength(3, {
    message: i18nValidationMessage('validation.VALIDATION_TITLE_MIN_LENGTH'),
  })
  @MaxLength(255, {
    message: i18nValidationMessage('validation.VALIDATION_TITLE_MAX_LENGTH'),
  })
  title: string;

  @IsNotEmpty()
  @IsString({
    message: i18nValidationMessage('validation.VALIDATION_AUTHOR_STRING'),
  })
  @MinLength(3, {
    message: i18nValidationMessage('validation.VALIDATION_AUTHOR_MIN_LENGTH'),
  })
  @MaxLength(255, {
    message: i18nValidationMessage('validation.VALIDATION_AUTHOR_MAX_LENGTH'),
  })
  author: string;

  @IsNotEmpty()
  @IsString({
    message: i18nValidationMessage('validation.VALIDATION_ISBN_STRING'),
  })
  @MinLength(10, {
    message: i18nValidationMessage('validation.VALIDATION_ISBN_MIN_LENGTH'),
  })
  @MaxLength(13, {
    message: i18nValidationMessage('validation.VALIDATION_ISBN_MAX_LENGTH'),
  })
  isbn: string;

  @IsNotEmpty()
  @IsInt({
    message: i18nValidationMessage(
      'validation.VALIDATION_AVAILABLE_COPIES_INT',
    ),
  })
  @Min(0, {
    message: i18nValidationMessage(
      'validation.VALIDATION_AVAILABLE_COPIES_MIN',
    ),
  })
  available_copies: number;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.VALIDATION_TITLE_STRING'),
  })
  @MinLength(3, {
    message: i18nValidationMessage('validation.VALIDATION_TITLE_MIN_LENGTH'),
  })
  @MaxLength(255, {
    message: i18nValidationMessage('validation.VALIDATION_TITLE_MAX_LENGTH'),
  })
  title?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.VALIDATION_AUTHOR_STRING'),
  })
  @MinLength(3, {
    message: i18nValidationMessage('validation.VALIDATION_AUTHOR_MIN_LENGTH'),
  })
  @MaxLength(255, {
    message: i18nValidationMessage('validation.VALIDATION_AUTHOR_MAX_LENGTH'),
  })
  author?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.VALIDATION_ISBN_STRING'),
  })
  @MinLength(10, {
    message: i18nValidationMessage('validation.VALIDATION_ISBN_MIN_LENGTH'),
  })
  @MaxLength(13, {
    message: i18nValidationMessage('validation.VALIDATION_ISBN_MAX_LENGTH'),
  })
  isbn?: string;

  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(
      'validation.VALIDATION_AVAILABLE_COPIES_INT',
    ),
  })
  @Min(0, {
    message: i18nValidationMessage(
      'validation.book.VALIDATION_AVAILABLE_COPIES_MIN',
    ),
  })
  available_copies?: number;
}
