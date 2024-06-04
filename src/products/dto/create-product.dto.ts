import { IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  public name: string;
}
