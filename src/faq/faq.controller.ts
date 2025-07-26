// src/faq/faq.controller.ts
import { Controller, Get, Post, Put,Delete,Body, Param } from '@nestjs/common';
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

    @Put(':id')
  update(@Param('id') id: string, @Body() faqData: Partial<Faq>): Promise<Faq> {
    return this.faqService.update(+id, faqData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.faqService.delete(+id);
  }
 
}
