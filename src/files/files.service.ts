import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync } from 'fs';
import * as fs from 'fs';
import { join } from 'path';
import { ErrorHandleService } from 'src/common/exception/exception.controller';
import { Product, ProductImage } from 'src/products/entities';
import { ProductsService } from 'src/products/products.service';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly errorHandler: ErrorHandleService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly productService: ProductsService,
  ) {}
  getStaticFile(imageName: string) {
    const path = join(__dirname, '../../src/static/products', imageName);
    if (!existsSync) {
      throw new BadRequestException(
        `No hay productos con la imagen ${imageName}`,
      );
    }
    return path;
  }

  async updateFile(id: string, img: string[]) {
    const product = await this.productRepository.findOneBy({ id });
    //console.log(product.images);
    // ? obtenemos las imagenes que vamos a borrar de la bd
    const i = product.images.map((image) => image.url);

    // ? Eliminamos las imagenes de la bd
    i.forEach((image) => {
      const pathImage = join(
        __dirname,
        '../../src/static/products',
        //./src/static/products
        image,
      );
      if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
      }
    });

    // ? Subir las nuevas imagenes a la bd
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ? borrar imagenes pertenecientes a un producto en la bd
      await queryRunner.manager.delete(ProductImage, { product: { id } });

      if (!product)
        throw new NotFoundException(
          `Producto con el id: ${id} no estan en la bd`,
        );

      // ? Subir nuevas imagenes a la bd
      product.images = img.map((i) =>
        this.productImageRepository.create({ url: i }),
      );
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction(); // ? Ejecuta los cambios y guarda en la bd
      await queryRunner.release(); // ? Se termina el queryRunner
      //await this.productRepository.save(product);
      //return product;
      return this.productService.findOnePlainProduct(id); // ? mostrar el producto actualizado ya aplanado
    } catch (error) {
      await queryRunner.rollbackTransaction(); // ? SI no se hizo efectivos los cambios se deja todo como estaba
      await queryRunner.release(); // ? se cierra el queryRunner
      this.errorHandler.errorHandleException(error);
    }

    //console.log(i);
    //return { id, img, i };
  }
}
