import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCodeDto } from './create-product-code.dto';
import { IsPositive } from 'class-validator';

export class UpdateProductCodeDto extends PartialType(CreateProductCodeDto) {
  @IsPositive()
  id: number;
}
