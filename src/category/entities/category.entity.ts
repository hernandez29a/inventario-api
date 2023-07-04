import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubCategory } from '../../sub-category/entities/sub-category.entity';

@Entity({ name: 'Categorias' })
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'text',
    unique: true,
  })
  nameCategory: string;

  @Column({
    type: 'text',
    nullable: true,
    // TODO colocar ruta si no hay imagen
    default: 'colocar ruta si no hay imagen',
  })
  image: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.categoriaId, {
    onUpdate: 'NO ACTION',
    eager: true,
  })
  subCategoria: SubCategory[];
}
