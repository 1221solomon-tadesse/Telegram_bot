import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './translation.entity';
import { TranslationService } from './translations.service';
import { TranslationController } from './translations.controller';
import { Question } from '../quations/question.entity';
import { Language } from '../languages/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Translation, Question, Language])],
  providers: [TranslationService],
  controllers: [TranslationController],
})
export class TranslationsModule {}
 