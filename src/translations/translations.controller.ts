import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { AddTranslationDto } from './dto/add-translation.dto';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly service: TranslationsService) {}

  @Post()
  add(@Body() dto: AddTranslationDto) {
    return this.service.add(dto);
  }

  @Get('question/:questionId')
  list(@Param('questionId') questionId: string) {
    return this.service.findForQuestion(+questionId);
  }
}
