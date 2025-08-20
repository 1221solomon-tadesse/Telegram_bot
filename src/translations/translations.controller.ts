import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { TranslationService } from './translations.service';

@Controller('translations')
export class TranslationController {
  constructor(private readonly service: TranslationService) {}

  @Post()
  create(
    @Body('questionId') questionId: number,
    @Body('languageCode') languageCode: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.service.create(questionId, languageCode, title, content);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.service.update(id, title, content);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

  @Get('question/:questionId/:languageCode')
  findByQuestionAndLanguage(
    @Param('questionId') questionId: number,
    @Param('languageCode') languageCode: string,
  ) {
    return this.service.findByQuestionAndLanguage(questionId, languageCode);
  }
}
