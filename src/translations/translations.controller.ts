import { Controller, Get, Post, Param, Body, Put, Delete, Query } from '@nestjs/common';
import { TranslationService } from './translations.service';

@Controller('translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  create(
    @Body('questionId') questionId: number,
    @Body('languageCode') languageCode: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.translationService.create(questionId, languageCode, title, content);
  }
  // ✅ Unified GET handler
  @Get()
  find(@Query('lang') lang?: string) {
    if (lang) {
      return this.translationService.findByLanguage(lang); // filtered by lang
    }
    return this.translationService.findAll(); // no filter → return all
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.translationService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.translationService.update(id, title, content);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.translationService.remove(id);
  }

  @Get('question/:questionId/:languageCode')
  findByQuestionAndLanguage(
    @Param('questionId') questionId: number,
    @Param('languageCode') languageCode: string,
  ) {
    return this.translationService.findByQuestionAndLanguage(questionId, languageCode);
  }
}
