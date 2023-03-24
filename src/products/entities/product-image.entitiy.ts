import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';

@Entity({ name: 'ProductosImagenes' })
export class ProductImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  url: string;

  // ? Realcion con productos
  //* clave foranea productId
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE', // ? si se borra el atributo raiz, se borra este tambien
  })
  product: Product;
}
