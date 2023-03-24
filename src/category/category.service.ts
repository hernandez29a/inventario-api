import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ErrorHandleService } from '../common/exception/exception.controller';

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

  async findAll() {
    try {
      const categories = await this.categoryRepository.find();
      return categories;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepository.findBy({ id });
      return category;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
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

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    //return `This action removes a #${id} category`;
  }
}
