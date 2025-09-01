import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatTranslation } from './catTranslation.entity';
import { Category } from '../category/category.entity';
import { Language } from '../languages/language.entity';
import { CatTranslationService } from './catTranslation.service';
import { CatTranslationController } from './catTranslation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CatTranslation, Category, Language])],
  providers: [CatTranslationService],
  controllers: [CatTranslationController],
})
export class CatTranslationModule {}
