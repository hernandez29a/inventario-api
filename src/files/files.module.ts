import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { ProductsModule } from 'src/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from 'src/products/entities';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    ConfigModule,
    CommonModule,
    ProductsModule,
    TypeOrmModule.forFeature([Product, ProductImage]),
  ],
})
export class FilesModule {}
