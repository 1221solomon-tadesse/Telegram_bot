import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from './telegram.service';
import { Language } from '../languages/language.entity';
import { Question } from '../quations/question.entity';
import { Translation } from 'src/translations/translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Language, Question,Translation])],
  providers: [TelegramService],
})
export class TelegramModule {}
