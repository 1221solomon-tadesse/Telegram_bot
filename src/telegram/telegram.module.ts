// src/telegram/telegram.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from './telegram.service';
import { Language } from '../languages/language.entity';
import { Question } from '../quations/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Language, Question])],
  providers: [TelegramService],
})
export class TelegramModule {}
