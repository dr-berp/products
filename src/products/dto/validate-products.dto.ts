import { IsArray, ArrayMinSize, ArrayUnique, ArrayNotEmpty, IsPositive } from 'class-validator';

export class ValidateProductDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsPositive({ each: true })
  public ids: number[];
}
