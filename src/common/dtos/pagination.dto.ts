import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    default: 5,
    description: 'Cuantos elementos mostrar por pagina',
  })
  @IsOptional()
  @IsPositive()
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 1,
    description: 'pagina de inicio',
  })
  @IsOptional()
  //@IsPositive()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  term?: string;
}
