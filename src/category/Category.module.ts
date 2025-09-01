import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CatTranslation } from 'src/categoryTranslation/catTranslation.entity';
import { Language } from 'src/languages/language.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, CatTranslation, Language]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
