import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database \\(^.^)/');
  }

  async create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const total = await this.product.count({ where: { enabled: true } });
    const lastPage = Math.ceil(total / limit);

    return {
      meta: { total, page, lastPage },
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: { enabled: true },
      }),
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, enabled: true },
      include: {
        codes: {
          select: { code: true },
        },
      },
    });

    if (!product)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
      });

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.product.update({ where: { id }, data: { enabled: false } });
  }

  async restore(id: number) {
    const product = await this.product.findFirst({ where: { id } });

    if (!product)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
      });

    if (product.enabled)
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: `Product with id ${id} is already enabled`,
      });

    return this.product.update({ where: { id }, data: { enabled: true, deletedAt: new Date() } });
  }

  async validate(ids: number[]) {
    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({ where: { id: { in: ids } } });

    if (products.length !== ids.length) {
      const notFound = ids.filter((id) => !products.some((product) => product.id === id));

      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Products with ids ${notFound.join(', ')} not found`,
      });
    }

    return products;
  }
}
