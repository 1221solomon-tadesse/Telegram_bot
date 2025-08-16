import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './translation.entity';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import { Question } from '../quations/question.entity';
import { Language } from '../languages/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Translation, Question, Language])],
  providers: [TranslationsService],
  controllers: [TranslationsController],
})
export class TranslationsModule {}
