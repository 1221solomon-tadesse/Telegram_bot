import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Language } from '../languages/language.entity';
import { User } from '../users/user.entity';
import { Category } from '../category/category.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private repo: Repository<Question>,
    @InjectRepository(Language) private langRepo: Repository<Language>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateQuestionDto) {
    const language = await this.langRepo.findOne({ where: { id: dto.languageId } });
    if (!language) throw new NotFoundException('Language not found');

    let createdBy: User | null = null;
    if (dto.createdByUserId) {
      createdBy = await this.userRepo.findOne({ where: { id: dto.createdByUserId } });
      if (!createdBy) throw new NotFoundException('Creator user not found');
    }

    let category: Category | null = null;
    if (dto.categoryId) {
      category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) throw new NotFoundException('Category not found');
    }

    const entity = this.repo.create({
      title: dto.title,
      content: dto.content,
      language,
      createdBy: createdBy ?? undefined,
      category: category ?? undefined,
    });
    return this.repo.save(entity);
  }

  async findOne(id: number) {
    const q = await this.repo.findOne({ where: { id }, relations: ['category', 'language'] });
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  async update(id: number, dto: UpdateQuestionDto) {
    const q = await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: Number(dto.categoryId) } });
      if (!category) throw new NotFoundException('Category not found');
      q.category = category;
    }

    Object.assign(q, dto);
    return this.repo.save(q);
  }

  async remove(id: number) {
    const q = await this.findOne(id);
    await this.repo.remove(q);
    return { success: true };
  }

  async findAll(langCode?: string, categoryId?: number) {
    const where: any = {};
    if (langCode) {
      where.language = { code: langCode };
    }
    if (categoryId) {
      where.category = { id: categoryId };
    }
    return this.repo.find({
      where,
      relations: ['language', 'category'],
    });
  }
  async findByCategory(categoryId: number) {
    return this.repo.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'language'],
    });
  }
}