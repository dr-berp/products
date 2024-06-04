import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ProductCodesModule } from './product-codes/product-codes.module';

@Module({
  imports: [ProductsModule, ProductCodesModule],
})
export class AppModule {}
