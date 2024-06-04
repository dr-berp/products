import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductCodesService } from './product-codes.service';
import { CreateProductCodeDto } from './dto/create-product-code.dto';
import { UpdateProductCodeDto } from './dto/update-product-code.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class ProductCodesController {
  constructor(private readonly productCodesService: ProductCodesService) {}

  @MessagePattern('product.code.health')
  healthCheck() {
    return 'Product Codes Service is up and running!';
  }

  @MessagePattern('product.code.create')
  create(@Payload() createProductCodeDto: CreateProductCodeDto) {
    return this.productCodesService.create(createProductCodeDto);
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
