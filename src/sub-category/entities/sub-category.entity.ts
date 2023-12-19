import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Product } from 'src/products/entities';
@Entity({ name: 'subCategorias' })
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  nameSubCategoria: string;

  // ? Relacion con categorias clave foranea
  @ManyToOne(() => Category, (categoria) => categoria.subCategoria)
  @JoinColumn({ name: 'categoriaId' }) //* nombre de la clave foranea
  categoriaId: Category;

  // ? relacion con la tabla productos
  @OneToMany(() => Product, (product) => product.subCategory, {
    onUpdate: 'NO ACTION',
    eager: true,
  })
  product: Product;
}
