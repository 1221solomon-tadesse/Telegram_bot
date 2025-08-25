import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from './translation.entity';
import { Question } from '../quations/question.entity';
import { Language } from '../languages/language.entity';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(Translation) private translationRepo: Repository<Translation>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Language) private languageRepo: Repository<Language>,
  ) {}

  async create(questionId: number, languageCode: string, title: string, content: string) {
    const question = await this.questionRepo.findOne({ where: { id: questionId } });
    if (!question) throw new NotFoundException(`Question with id ${questionId} not found`);

    const language = await this.languageRepo.findOne({ where: { code: languageCode } });
    if (!language) throw new NotFoundException(`Language ${languageCode} not found`);

    const translation = this.translationRepo.create({ question, language, title, content });
    return this.translationRepo.save(translation);
  }

  async findAll() {
    return this.translationRepo.find({ relations: ['question', 'language'] });
  }

  async findOne(id: number) {
    const translation = await this.translationRepo.findOne({ where: { id }, relations: ['question', 'language'] });
    if (!translation) throw new NotFoundException(`Translation ${id} not found`);
    return translation;
  }

  async update(id: number, title: string, content: string) {
    const translation = await this.findOne(id);
    translation.title = title ?? translation.title;
    translation.content = content ?? translation.content;
    return this.translationRepo.save(translation);
  }

  async remove(id: number) {
    const translation = await this.findOne(id);
    return this.translationRepo.remove(translation);
  }

  async findByQuestionAndLanguage(questionId: number, languageCode: string) {
    return this.translationRepo.findOne({
      where: { question: { id: questionId }, language: { code: languageCode } },
      relations: ['question', 'language'],
    });

  }
async findByLanguage(languageCode: string) {
  if (languageCode === 'en') {
    // ✅ Explicitly filter only English questions
    return this.questionRepo.find({
      where: { language: { code: 'en' } },
      select: ['title', 'content'],
      relations: ['language'],
    });
  }

  // ✅ Otherwise fetch from translations
  return this.translationRepo.find({
    where: { language: { code: languageCode } },
    select: ['title', 'content'],
    relations: ['language'],
  });
}


}

