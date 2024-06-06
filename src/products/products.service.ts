import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

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

    const where = true ? {} : { enabled: true };
    const total = await this.product.count({ where });
    const lastPage = Math.ceil(total / limit);

    const data = await this.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where,
    });

    return {
      meta: { total, page, lastPage },
      data,
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, enabled: true },
      include: {
        codes: {
          where: { enabled: true },
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

    return this.product.update({ where: { id }, data: { enabled: false, deletedAt: new Date() } });
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

    return this.product.update({ where: { id }, data: { enabled: true, deletedAt: null } });
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
