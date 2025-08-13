// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Faq } from './faq/faq.entity';
import { TelegramModule } from './telegram/telegram.module';
import { FaqModule } from './faq/faq.module';
import { AssignmentsService } from './assignments/assignments.service';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available across modules
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [User, Faq],
        synchronize: true,
      }),
    }),
    UsersModule,
    TelegramModule,
    FaqModule,
    AssignmentsModule,
  ],
  providers: [AssignmentsService],
})
export class AppModule {}
