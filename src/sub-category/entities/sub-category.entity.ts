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
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'text',
    unique: true,
  })
  nameSubCategoria: string;

  @Column({
    type: 'text',
    unique: true,
  })
  codSubCategory: string;

  // ? Relacion con categorias clave foranea
  @ManyToOne(() => Category, (categoria) => categoria.subCategoria)
  @JoinColumn({ name: 'categoriaId' }) //* nombre de la clave foranea
  categoriaId: Category;

  // ? relacion con la tabla productos
  @OneToMany(() => Product, (product) => product.subCategory)
  product: Product;
}
