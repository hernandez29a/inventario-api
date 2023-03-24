import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategory } from './entities/sub-category.entity';
import { Repository } from 'typeorm';
import { ErrorHandleService } from '../common/exception/exception.controller';

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
    return 'This action adds a new subCategory';
  }

  findAll() {
    return `This action returns all subCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subCategory`;
  }

  update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    return `This action updates a #${id} subCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subCategory`;
  }
}
