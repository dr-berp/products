import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PaginationDto } from 'src/common';
import { CreateProductDto, UpdateProductDto, ValidateProductDto as ValidateProductsDto } from './dto';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('product.health')
  healthCheck() {
    return 'Products service is up and running!';
  }

  @MessagePattern('product.create')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern('product.findAll')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern('product.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @MessagePattern('product.update')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  @MessagePattern('product.remove')
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern('product.restore')
  restore(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.restore(id);
  }

  @MessagePattern('product.validate')
  validate(@Payload() validateProductsDto: ValidateProductsDto) {
    return this.productsService.validate(validateProductsDto.ids);
  }
}
