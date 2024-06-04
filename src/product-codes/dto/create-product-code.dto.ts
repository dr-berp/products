import { IsPositive } from 'class-validator';

export class CreateProductCodeDto {
  @IsPositive()
  productId: number;
}
