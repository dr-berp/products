import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto, User } from 'src/common';
import { CreateProductCodeDto, UpdateProductCodeDto } from './dto';
import { ProductCodesService } from './product-codes.service';

@Controller()
export class ProductCodesController {
  constructor(private readonly productCodesService: ProductCodesService) {}

  @MessagePattern('product.code.health')
  healthCheck() {
    return 'Product Codes Service is up and running!';
  }

  @MessagePattern('product.code.create')
  create(@Payload() payload: { createProductCodeDto: CreateProductCodeDto; user: User }) {
    const { createProductCodeDto, user } = payload;
    return this.productCodesService.create(createProductCodeDto, user);
  }

  @MessagePattern('product.code.findAll')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productCodesService.findAll(paginationDto);
  }

  @MessagePattern('product.code.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productCodesService.findOne(id);
  }

  @MessagePattern('product.code.update')
  update(@Payload() updateProductCodeDto: UpdateProductCodeDto) {
    return this.productCodesService.update(updateProductCodeDto);
  }

  @MessagePattern('product.code.remove')
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productCodesService.remove(id);
  }

  @MessagePattern('product.code.restore')
  restore(@Payload('id', ParseIntPipe) id: number) {
    return this.productCodesService.restore(id);
  }
}
