import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, ProductImage } from './entities';
import { CommonModule } from '../common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    ConfigModule,
    CommonModule,
    AuthModule,
    TypeOrmModule.forFeature([Product, ProductImage]),
  ],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
