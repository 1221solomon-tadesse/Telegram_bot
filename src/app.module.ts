import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from './users/user.entity';
import { Language } from './languages/language.entity';
import { Question } from './quations/question.entity';
import { Translation } from './translations/translation.entity';
import { Assignment } from './assignments/assignment.entity';

import { UsersModule } from './users/users.module';
import { LanguagesModule } from './languages/languages.module';
import { QuestionsModule } from "./quations/questions.module"
import { TranslationsModule } from './translations/translations.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { TelegramModule } from './telegram/telegram.module';
import { TelegramUsersModule } from './telegram-users/telegram-users.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get<number>('DB_PORT')! || 5432,
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [User, Language, Question, Translation, Assignment],
        synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),
    UsersModule,
    LanguagesModule,
    QuestionsModule,
    TranslationsModule,
    AssignmentsModule,
    TelegramModule, // 
    TelegramUsersModule,
  ],
})
export class AppModule {}
