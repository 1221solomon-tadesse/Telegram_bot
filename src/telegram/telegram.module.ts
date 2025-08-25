import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from './telegram.service';
import { Language } from '../languages/language.entity';
import { Question } from '../quations/question.entity';
import { Translation } from 'src/translations/translation.entity';
import { TelegramUser } from 'src/telegram-users/telegram-user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Language, Question,Translation,TelegramUser])],
  providers: [TelegramService],
})
export class TelegramModule {}
