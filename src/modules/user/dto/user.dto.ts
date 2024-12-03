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
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignUpDto {
    @IsString({
        message: i18nValidationMessage(
            'validation.VALIDATION_FIRST_NAME_STRING',
        ),
    })
    @IsNotEmpty({
        message: i18nValidationMessage(
            'validation.VALIDATION_FIRST_NAME_STRING',
        ),
    })
    @MinLength(2, {
        message: i18nValidationMessage(
            'validation.VALIDATION_FIRST_NAME_MIN_LENGTH',
        ),
    })
    @MaxLength(75, {
        message: i18nValidationMessage(
            'validation.VALIDATION_FIRST_NAME_MAX_LENGTH',
        ),
    })
    firstName: string;

    @IsOptional()
    @IsString({
        message: i18nValidationMessage(
            'validation.VALIDATION_LAST_NAME_STRING',
        ),
    })
    @MinLength(2, {
        message: i18nValidationMessage(
            'validation.VALIDATION_LAST_NAME_MIN_LENGTH',
        ),
    })
    @MaxLength(75, {
        message: i18nValidationMessage(
            'validation.VALIDATION_LAST_NAME_MAX_LENGTH',
        ),
    })
    lastName?: string;

    @IsString({
        message: i18nValidationMessage('validation.VALIDATION_EMAIL_VALID'),
    })
    @IsEmail(
        {},
        { message: i18nValidationMessage('validation.VALIDATION_EMAIL_VALID') },
    )
    @MaxLength(255, {
        message: i18nValidationMessage('validation.VALIDATION_EMAIL_VALID'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.VALIDATION_EMAIL_VALID'),
    })
    email: string;

    @IsString({
        message: i18nValidationMessage('validation.VALIDATION_PASSWORD_STRONG'),
    })
    @IsStrongPassword(
        {},
        {
            message: i18nValidationMessage(
                'validation.VALIDATION_PASSWORD_STRONG',
            ),
        },
    )
    @IsNotEmpty({
        message: i18nValidationMessage(
            'validation.VALIDATION_PASSWORD_REQUIRED',
        ),
    })
    password: string;
}

export class SignInDto {
    @IsString({
        message: i18nValidationMessage('validation.VALIDATION_EMAIL_VALID'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.VALIDATION_EMAIL_VALID'),
    })
    @IsEmail(
        {},
        { message: i18nValidationMessage('validation.VALIDATION_EMAIL_VALID') },
    )
    email: string;

    @IsNotEmpty({
        message: i18nValidationMessage(
            'validation.VALIDATION_PASSWORD_REQUIRED',
        ),
    })
    @IsString({
        message: i18nValidationMessage(
            'validation.VALIDATION_PASSWORD_REQUIRED',
        ),
    })
    password: string;
}

export class VerifyOtpDto {
    @IsNumber(
        {},
        {
            message: i18nValidationMessage(
                'validation.VALIDATION_OTP_REQUIRED',
            ),
        },
    )
    @IsNotEmpty({
        message: i18nValidationMessage('validation.VALIDATION_OTP_REQUIRED'),
    })
    otp: number;

    @IsString({
        message: i18nValidationMessage('validation.VALIDATION_EMAIL_VALID'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.VALIDATION_EMAIL_VALID'),
    })
    @IsEmail(
        {},
        { message: i18nValidationMessage('validation.VALIDATION_EMAIL_VALID') },
    )
    email: string;
}

export class UpdateUserDto {
    @IsString({
        message: i18nValidationMessage(
            'validation.VALIDATION_FIRST_NAME_STRING',
        ),
    })
    @IsOptional()
    @MinLength(2, {
        message: i18nValidationMessage(
            'validation.VALIDATION_FIRST_NAME_MIN_LENGTH',
        ),
    })
    @MaxLength(255, {
        message: i18nValidationMessage(
            'validation.VALIDATION_FIRST_NAME_MAX_LENGTH',
        ),
    })
    firstName?: string;

    @IsString({
        message: i18nValidationMessage(
            'validation.VALIDATION_LAST_NAME_STRING',
        ),
    })
    @IsOptional()
    @MinLength(2, {
        message: i18nValidationMessage(
            'validation.VALIDATION_LAST_NAME_MIN_LENGTH',
        ),
    })
    @MaxLength(255, {
        message: i18nValidationMessage(
            'validation.VALIDATION_LAST_NAME_MAX_LENGTH',
        ),
    })
    lastName?: string;

    @IsString({
        message: i18nValidationMessage('validation.VALIDATION_PASSWORD_STRONG'),
    })
    @IsOptional()
    @IsStrongPassword(
        {},
        {
            message: i18nValidationMessage(
                'validation.VALIDATION_PASSWORD_STRONG',
            ),
        },
    )
    password?: string;
}

export class SetUsernameDto {
    @IsString({
        message: i18nValidationMessage('validation.VALIDATION_USERNAME_STRING'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.VALIDATION_USERNAME_STRING'),
    })
    @MinLength(5, {
        message: i18nValidationMessage(
            'validation.VALIDATION_USERNAME_MIN_LENGTH',
        ),
    })
    @MaxLength(20, {
        message: i18nValidationMessage(
            'validation.VALIDATION_USERNAME_MAX_LENGTH',
        ),
    })
    username: string;
}
