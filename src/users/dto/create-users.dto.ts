import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Subscription } from '../../entity/users-subscription-entity';

export class CreateUsersDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  stripeUserId: string;

  paymontMethodId: string;

  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(16)
  @MinLength(16)
  number: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(12)
  @Min(1)
  exp_month: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(2025)
  @Min(2023)
  exp_year: number;

  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(3)
  @MinLength(3)
  cvc: string;

  subscription: Subscription[];
}
