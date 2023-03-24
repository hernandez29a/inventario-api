import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  MinLength,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Titulo del Producto',
    nullable: false,
    minLength: 1,
    uniqueItems: true,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'Precio del Producto',
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Descripción del Producto',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Slug del Producto',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsIn(['niño', 'mujer', 'hombre', 'unisex'])
  gender: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
