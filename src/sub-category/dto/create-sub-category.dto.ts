import { IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '../../category/entities/category.entity';

export class CreateSubCategoryDto {
  @IsString()
  @MinLength(3)
  nameSubCategoria: string;

  @IsString()
  @Type(() => String) // ? Transformamos a string
  categoriaId: Category;
}
