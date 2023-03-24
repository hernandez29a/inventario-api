import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
@Entity({ name: 'subCategorias' })
export class SubCategory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'text',
    unique: true,
  })
  nameSubCategoria: string;

  // ? Relacion con categorias clave foranea
  @ManyToOne(() => Category, (categoria) => categoria.subCategoria)
  @JoinColumn({ name: 'categoriaId' }) //* nombre de la clave foranea
  categoriaId: Category;
}
