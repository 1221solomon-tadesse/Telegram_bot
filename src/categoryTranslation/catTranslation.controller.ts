import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CatTranslationService } from './catTranslation.service';

@Controller('cat-translations')
export class CatTranslationController {
  constructor(private readonly catTranslationService: CatTranslationService) {}

  @Post()
  create(
    @Body('categoryId') categoryId: number,
    @Body('languageId') languageId: number,
    @Body('name') name: string,
  ) {
    return this.catTranslationService.create(categoryId, languageId, name);
  }

  @Get()
  findAll() {
    return this.catTranslationService.findAll();
  }

  @Get('language/:code')
  findByLanguage(@Param('code') code: string) {
    return this.catTranslationService.findByLanguage(code);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body('name') name: string) {
    return this.catTranslationService.update(id, name);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.catTranslationService.remove(id);
  }
}
