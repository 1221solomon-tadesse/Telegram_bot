import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Language } from '../languages/language.entity';
import { User } from '../users/user.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private repo: Repository<Question>,
    @InjectRepository(Language) private langRepo: Repository<Language>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateQuestionDto) {
    const language = await this.langRepo.findOne({ where: { id: dto.languageId } });
    if (!language) throw new NotFoundException('Language not found');

    let createdBy: User | null = null;
    if (dto.createdByUserId) {
      createdBy = await this.userRepo.findOne({ where: { id: dto.createdByUserId } });
      if (!createdBy) throw new NotFoundException('Creator user not found');
    }

    const entity = this.repo.create({
      title: dto.title,
      content: dto.content,
      language,
      createdBy: createdBy ?? null,
    });
    return this.repo.save(entity);
  }

  findAll(langCode?: string) {
    if (langCode) {
      return this.repo
        .createQueryBuilder('q')
        .leftJoinAndSelect('q.language', 'language')
        .leftJoinAndSelect('q.createdBy', 'createdBy')
        .where('language.code = :code', { code: langCode })
        .orderBy('q.createdAt', 'DESC')
        .getMany();
    }
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const q = await this.repo.findOne({ where: { id } });
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  async update(id: number, dto: UpdateQuestionDto) {
    const q = await this.findOne(id);
    Object.assign(q, dto);
    return this.repo.save(q);
  }

  async remove(id: number) {
    const q = await this.findOne(id);
    await this.repo.remove(q);
    return { success: true };
  }
}
