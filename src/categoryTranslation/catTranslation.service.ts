import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatTranslation } from './catTranslation.entity';
import { Category } from '../category/category.entity';
import { Language } from '../languages/language.entity';

@Injectable()
export class CatTranslationService {
  constructor(
    @InjectRepository(CatTranslation)
    private readonly catTranslationRepo: Repository<CatTranslation>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Language)
    private readonly languageRepo: Repository<Language>,
  ) {}

  async create(categoryId: number, languageId: number, name: string) {
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
    if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

    const language = await this.languageRepo.findOne({ where: { id: languageId } });
    if (!language) throw new NotFoundException(`Language ${languageId} not found`);

    const translation = this.catTranslationRepo.create({
      categories: category,
      language,
      name,
    });

    return this.catTranslationRepo.save(translation);
  }

  async findAll() {
    return this.catTranslationRepo.find({
      relations: ['categories', 'language'],
    });
  }

  async findByLanguage(languageCode: string) {
    return this.catTranslationRepo
      .createQueryBuilder('ct')
      .leftJoinAndSelect('ct.categories', 'category')
      .leftJoinAndSelect('ct.language', 'language')
      .where('language.code = :code', { code: languageCode })
      .getMany();
  }

  async update(id: number, name: string) {
    const translation = await this.catTranslationRepo.findOne({ where: { id } });
    if (!translation) throw new NotFoundException(`Translation ${id} not found`);

    translation.name = name;
    return this.catTranslationRepo.save(translation);
  }

  async remove(id: number) {
    const translation = await this.catTranslationRepo.findOne({ where: { id } });
    if (!translation) throw new NotFoundException(`Translation ${id} not found`);
    return this.catTranslationRepo.remove(translation);
  }
}
