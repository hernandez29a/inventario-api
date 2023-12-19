import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategory } from './entities/sub-category.entity';
import { Repository } from 'typeorm';
import { ErrorHandleService } from '../common/exception/exception.controller';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    private readonly errorHandler: ErrorHandleService,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    try {
      const subCategory =
        this.subCategoryRepository.create(createSubCategoryDto);
      await this.subCategoryRepository.save(subCategory);
      return subCategory;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 1 } = paginationDto;
    const pagination = (offset - 1) * limit;
    const builder = await this.subCategoryRepository.createQueryBuilder(
      'subCategory',
    );
    const totalRegistros = await builder.getCount();
    const totalPaginas = Math.ceil((totalRegistros * 1) / limit);
    const subCategory = await this.subCategoryRepository.find({
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
    return { subCategory, paginar };
  }

  async findOne(id: string) {
    const subCategori = await this.subCategoryRepository.findOneBy({ id: id });
    this.findValidSubcategory(subCategori);
    return subCategori;
  }

  async findValidSubcategory(subCategory: SubCategory) {
    if (!subCategory) {
      throw new NotFoundException(
        `Subcategory with id: ${subCategory.id} not in data base`,
      );
    }
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryRepository.preload({
      id,
      ...updateSubCategoryDto,
    });
    if (!subCategory) {
      throw new NotFoundException(
        `La sub-categoria con el id : ${id} no esta en la bd`,
      );
    }
    try {
      await this.subCategoryRepository.save(subCategory); //* Guardar en la Base de datos
      return subCategory;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async remove(id: string) {
    const subCategory = await this.findOne(id);
    await this.subCategoryRepository.remove(subCategory);
    return `la sub categaria ${subCategory} ha sido eliminada`;
  }
}
