// src/faq/faq.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FaqService } from './faq.service';
import { Faq } from './faq.entity';

@Controller('faq')
export class FaqController {
  constructor(private faqService: FaqService) {}

  @Get()
  getAll(): Promise<Faq[]> {
    return this.faqService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<Faq> {
    return this.faqService.findOne(id);
  }

  @Post()
  create(@Body() faq: Partial<Faq>): Promise<Faq> {
    return this.faqService.create(faq);
  }

  // ✅ New route to search by question
  @Get('search/:question')
  findByQuestion(@Param('question') question: string): Promise<Faq | null> {
    return this.faqService.findByQuestion(question);
  }
}
