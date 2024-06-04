import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { CreateProductCodeDto, UpdateProductCodeDto } from './dto';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductCodesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductCodesService');

  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database \\(^.^)/');
  }

  async create(createProductCodeDto: CreateProductCodeDto) {
    try {
      const productCode = await this.productCode.create({
        data: {
          code: await this.getLastProductCode(),
          product: {
            connect: {
              id: createProductCodeDto.productId,
            },
          },
        },
      });

      return productCode;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Error creating product code: ${error.message}`,
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const total = await this.productCode.count({ where: { enabled: true } });
    const lastPage = Math.ceil(total / limit);

    return {
      meta: { total, page, lastPage },
      data: await this.productCode.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: { enabled: true },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      }),
    };
  }

  async findOne(id: number) {
    const productCode = await this.productCode.findFirst({
      where: { id, enabled: true },
    });

    if (!productCode)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product Code with id ${id} not found`,
      });

    return productCode;
  }

  async update(updateProductCodeDto: UpdateProductCodeDto) {
    const { id, ...data } = updateProductCodeDto;
    await this.findOne(id);

    return this.productCode.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.productCode.update({
      where: { id },
      data: { enabled: false, deletedAt: new Date() },
    });
  }

  async restore(id: number) {
    const productCode = await this.productCode.findFirst({ where: { id } });

    if (!productCode)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product Code with id ${id} not found`,
      });

    return this.productCode.update({
      where: { id },
      data: { enabled: true, deletedAt: null },
    });
  }

  async getLastProductCode(): Promise<number> {
    const lastProductCode = await this.productCode.findFirst({
      orderBy: {
        id: 'desc',
      },
    });

    return lastProductCode ? lastProductCode.code + 1 : 1;
  }
}
