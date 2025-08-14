// src/faq/faq.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FAQ } from './faq.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(FAQ)
    private faqRepo: Repository<FAQ>, // FIXED type here
  ) {}

  findAll(): Promise<FAQ[]> {
    return this.faqRepo.find();
  }

  async findOne(id: number): Promise<FAQ> {
    const faq = await this.faqRepo.findOneBy({ id }); // lowercase variable
    if (!faq) throw new NotFoundException('FAQ not found');
    return faq;
  }

  create(faqData: Partial<FAQ>): Promise<FAQ> { 
    const faq = this.faqRepo.create(faqData); 
    return this.faqRepo.save(faq);
  }

  async update(id: number, data: Partial<FAQ>): Promise<FAQ> {
    const faq = await this.findOne(id);
    Object.assign(faq, data);
    return this.faqRepo.save(faq);
  }

  async delete(id: number): Promise<void> {
    const result = await this.faqRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('FAQ not found');
    }
  }
}
