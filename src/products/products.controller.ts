import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PaginationDto, User } from 'src/common';
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
  create(@Payload() payload: { createProductDto: CreateProductDto; user: User }) {
    const { createProductDto, user } = payload;
    return this.productsService.create(createProductDto, user);
  }

  @MessagePattern('product.findAll')
  findAll(@Payload() payload: { paginationDto: PaginationDto }) {
    const { paginationDto } = payload;

    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern('product.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @MessagePattern('product.update')
  update(@Payload() payload: { updateProductDto: UpdateProductDto; user: User }) {
    const { updateProductDto, user } = payload;
    return this.productsService.update(updateProductDto, user);
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
