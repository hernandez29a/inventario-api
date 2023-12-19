import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ErrorHandleService } from '../common/exception/exception.controller';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly errorHandler: ErrorHandleService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 1 } = paginationDto;
    const pagination = (offset - 1) * limit;
    const builder = this.categoryRepository.createQueryBuilder('caytegory');
    const totalRegistros = await builder.getCount();
    const totalPaginas = Math.ceil((totalRegistros * 1) / limit);
    try {
      const categories = await this.categoryRepository.find({
        take: limit,
        skip: pagination,
      });
      const paginar = {
        antes: offset - 1,
        actual: offset,
        despues: offset + 1,
        totalRegistros,
        totalPaginas,
      };
      return { categories, paginar };
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.categoryRepository.findBy({ id });
      return category;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });
    if (!category) {
      throw new NotFoundException(
        `La categoria con el id : ${id} no esta en la bd`,
      );
    }
    try {
      await this.categoryRepository.save(category); //* Guardar en la Base de datos
      return category;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    //return `This action removes a #${id} category`;
  }
}
