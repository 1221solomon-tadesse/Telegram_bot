// src/faq/faq.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from './faq.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepo: Repository<Faq>,
  ) {}

  findAll(): Promise<Faq[]> {
    return this.faqRepo.find();
  }

  async findOne(id: number): Promise<Faq> {
    const faq = await this.faqRepo.findOneBy({ id });
    if (!faq) throw new NotFoundException('FAQ not found');
    return faq;
  }

  create(faq: Partial<Faq>): Promise<Faq> {
    return this.faqRepo.save(faq);
  }
  async findByQuestion(question: string): Promise<Faq | null> {
  return this.faqRepo.findOne({ where: { question } });
}

}
