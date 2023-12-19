import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { GetUser } from 'src/auth/decorators';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.superUser, ValidRoles.admin) // * Solo usuario permitidos tiene acceso
  @ApiResponse({
    status: 201,
    description: 'El producto ha sido creado con exito',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Token related',
  })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Auth() //* todos los roles tiene acceso pero tiene q estar autenticado
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() subCategory: Product,
  ) {
    //console.log(paginationDto);
    return this.productsService.findAll(paginationDto, subCategory);
  }

  @Get(':term')
  @Auth() //* todos los roles tiene acceso
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlainProduct(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin) // * Solo usuario permitidos tiene acceso
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin) // * Solo usuario permitidos tiene acceso
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
