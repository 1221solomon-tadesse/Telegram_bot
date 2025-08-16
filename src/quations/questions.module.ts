import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Language } from '../languages/language.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Language, User])],
  providers: [QuestionsService],
  controllers: [QuestionsController],
  exports: [QuestionsService],
})
export class QuestionsModule {}
