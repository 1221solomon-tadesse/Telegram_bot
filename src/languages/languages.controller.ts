import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly service: LanguagesService) {}

  @Post()
  create(@Body() dto: CreateLanguageDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.service.findByCode(code);
  }
}
