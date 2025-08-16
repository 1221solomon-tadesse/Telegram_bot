import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from './translation.entity';
import { Question } from '../quations/question.entity';
import { Language } from '../languages/language.entity';
import { AddTranslationDto } from './dto/add-translation.dto';

@Injectable()
export class TranslationsService {
  constructor(
    @InjectRepository(Translation) private repo: Repository<Translation>,
    @InjectRepository(Question) private qRepo: Repository<Question>,
    @InjectRepository(Language) private langRepo: Repository<Language>,
  ) {}

  async add(dto: AddTranslationDto) {
    const question = await this.qRepo.findOne({ where: { id: dto.questionId } });
    if (!question) throw new NotFoundException('Question not found');

    const language = await this.langRepo.findOne({ where: { id: dto.languageId } });
    if (!language) throw new NotFoundException('Language not found');

    const t = this.repo.create({
      question,
      language,
      title: dto.title,
      content: dto.content,
    });
    return this.repo.save(t);
  }

  findForQuestion(questionId: number) {
    return this.repo.find({
      where: { question: { id: questionId } },
      relations: { question: true, language: true },
    });
  }
}
