import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CatTranslation } from '../categoryTranslation/catTranslation.entity';
import { Language } from '../languages/language.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CatTranslation)
    private translationRepository: Repository<CatTranslation>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create();
    await this.categoryRepository.save(category);

    // save translations
    for (const t of dto.translations) {
      const lang = await this.languageRepository.findOneBy({ code: t.langCode });
      if (!lang) {
        throw new Error(`Language with code ${t.langCode} not found`);
      }
      const translation = this.translationRepository.create({
        categories: category,
        language: lang,
        name: t.name,
      });
      await this.translationRepository.save(translation);
    }

    return this.findOne(category.id);
  }

  findAll(lang?: string) {
    if (lang) {
      return this.translationRepository.find({
        where: { language: { code: lang } },
        relations: ['categories', 'language'],
      });
    }
    return this.categoryRepository.find({ relations: ['catTranslation', 'catTranslation.language'] });
  }

  async findOne(id: number, lang?: string) {
    if (lang) {
      return this.translationRepository.findOne({
        where: { categories: { id }, language: { code: lang } },
        relations: ['categories', 'language'],
      });
    }
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['catTranslation', 'catTranslation.language'],
    });
  }

  async update(id: number, dto: CreateCategoryDto) {
    const category = await this.findOne(id);
    if (!category) return null;

    // Update translations
    for (const t of dto.translations) {
      const lang = await this.languageRepository.findOneBy({ code: t.langCode });
      let translation = await this.translationRepository.findOne({
        where: { categories: { id }, language: { code: t.langCode } },
      });

      if (translation) {
        translation.name = t.name;
        await this.translationRepository.save(translation);
      } else if (lang) {
        translation = this.translationRepository.create({
          categories: category, // or use the correct property name as defined in CatTranslation entity, e.g., 'category'
          language: lang,
          name: t.name,
        });
        await this.translationRepository.save(translation);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
