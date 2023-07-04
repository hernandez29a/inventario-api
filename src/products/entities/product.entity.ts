import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SubCategory } from 'src/sub-category/entities/sub-category.entity';

@Entity({ name: 'Productos' })
export class Product {
  @ApiProperty({
    example: '80e14ac1-02d9-4d3c-8059-f9b6bc528b51',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'franela',
    description: 'Titulo del producto',
    uniqueItems: true,
  })
  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Precio del producto',
  })
  @Column({
    type: 'float',
    default: 0,
  })
  price: number;

  @ApiProperty({
    example:
      'este producto ha sido creado con tela de microfibra , y lo hay desde la talla s hasta la m',
    description: 'descripción del producto',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'franela',
    description: 'SLUG del producto - para el SEO',
    default: null,
  })
  @Column({
    unique: true,
    type: 'text',
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'cantidad del producto',
    default: 0,
  })
  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'S', 'SS'],
    description: 'tallas del producto',
  })
  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: ['niño', 'mujer', 'hombre', 'unisex'],
    description: 'generos existentes',
  })
  @Column({
    type: 'enum',
    enum: ['niño', 'mujer', 'hombre', 'unisex'],
    nullable: false,
  })
  gender: string;

  @ApiProperty({
    example: ['deporte', 'casual', 'formal'],
    description: 'categorías existentes',
  })
  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];

  // ? Realcion con Imagenes de productos
  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  // ? Relacion con Usuarios
  @ManyToOne(() => User, (user) => user.product, {
    eager: true,
  })
  user: User;

  // ? Relacion con subCategorias
  @ManyToOne(() => SubCategory, (subCategory) => subCategory.product, {
    eager: true,
  })
  subCategory: SubCategory;

  @BeforeInsert()
  checkSlugInsert(): void {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.title
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
