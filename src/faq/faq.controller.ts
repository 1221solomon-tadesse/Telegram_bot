// src/faq/faq.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FAQ } from './faq.entity';

@Controller('faq') // usually lowercase in URL
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // Get all FAQs
  @Get()
  getAll(): Promise<FAQ[]> {
    return this.faqService.findAll();
  }

  // Get one FAQ by ID
  @Get(':id')
  getOne(@Param('id') id: number): Promise<FAQ> {
    return this.faqService.findOne(id);
  }

  // Create a new FAQ
  @Post()
  create(@Body() faqData: Partial<FAQ>): Promise<FAQ> {
    return this.faqService.create(faqData);
  }

  // Update an existing FAQ
  @Put(':id')
  update(@Param('id') id: string, @Body() faqData: Partial<FAQ>): Promise<FAQ> {
    return this.faqService.update(+id, faqData);
  }

  // Delete a FAQ
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.faqService.delete(+id);
  }
}
