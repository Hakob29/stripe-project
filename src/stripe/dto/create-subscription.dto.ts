import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  priceId: string;
  @IsNotEmpty()
  @IsString()
  customerId: string;
}
