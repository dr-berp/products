import { Type } from 'class-transformer';
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  public name: string;
}
