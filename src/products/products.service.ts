import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';
import { ErrorHandleService } from '../common/exception/exception.controller';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, //? respositorio de productos

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>, //? respositorio de imagenes de productos

    private readonly dataSource: DataSource,

    private readonly errorHandler: ErrorHandleService,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...restoProduc } = createProductDto;
      const product = this.productRepository.create({
        ...restoProduc,
        user,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      //console.log(error);
      this.errorHandler.errorHandleException(error);
    }
    //return 'This action adds a new product';
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 1 } = paginationDto;
    const paginacion = (offset - 1) * limit;
    const builder = this.productRepository.createQueryBuilder('producto');
    const totalRegistros = await builder.getCount();
    const totalPaginas = Math.ceil((totalRegistros * 1) / limit);
    const products = await this.productRepository.find({
      take: limit,
      skip: paginacion,
      relations: { images: true },
    });

    // ? Utilizar las funciones prinitivas para crear un objeto totalmente diferente al priimero
    // ? se usa map en prducts para luego hacr otro map en las imagenes y solo traer el url de las mismas
    const productoAplanado = products.map((products) => ({
      ...products,
      images: products.images.map((img) => img.url),
    }));
    const paginar = {
      antes: offset - 1,
      actual: offset,
      despues: offset + 1,
      totalRegistros,
      totalPaginas,
    };
    return { productoAplanado, paginar };
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const builder = this.productRepository.createQueryBuilder('prod');
      product = await builder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }
    //const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(
        `El producto id: ${term} no se encuentra en la bd`,
      );
    }
    return product;
    //return `This action returns a #${id} product`;
  }

  // ? Metodo para aplanar un producto obtenido por un termino de busqueda
  async findOnePlainProduct(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    // ? Utilizar las funciones prinitivas para crear un objeto totalmente diferente al priimero
    // ? se usa map en prducts para luego hacr otro map en las imagenes y solo traer el url de las mismas
    return {
      ...product,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...restoProduc } = updateProductDto;

    // * Crear el query runner esto es si vienen imagenes , se borran las anteriores y se colocan las nuevas
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const product = await this.productRepository.preload({
      id,
      ...restoProduc,
    });

    if (!product)
      throw new NotFoundException(
        `Producto con el id: ${id} no estan en la bd`,
      );
    try {
      // ? Si las imagenes viene, borrar las que esta nrelacionadas al id del producto
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } }); // ? borrar imagenes pertenecientes a un producto

        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }
      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction(); // ? Ejecuta los cambios y guarda en la bd
      await queryRunner.release(); // ? Se termina el queryRunner
      //await this.productRepository.save(product);
      //return product;
      return this.findOnePlainProduct(id); // ? mostrar el producto actualizado ya aplanado
    } catch (error) {
      await queryRunner.rollbackTransaction(); // ? SI no se hizo efectivos los cambios se deja todo como estaba
      await queryRunner.release(); // ? se cierra el queryRunner
      this.errorHandler.errorHandleException(error);
    }
  }

  // ? Eliminar definitivo un producto
  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // ? Eliminar todos los registros
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }
}
