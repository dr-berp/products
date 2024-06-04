import { Module } from '@nestjs/common';
import { ProductCodesService } from './product-codes.service';
import { ProductCodesController } from './product-codes.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductCodesController],
  providers: [ProductCodesService],
  imports: [NatsModule],
})
export class ProductCodesModule {}
