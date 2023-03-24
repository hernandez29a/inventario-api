import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  imports: [CommonModule, AuthModule, TypeOrmModule.forFeature([SubCategory])],
  exports: [SubCategoryService, TypeOrmModule],
})
export class SubCategoryModule {}
