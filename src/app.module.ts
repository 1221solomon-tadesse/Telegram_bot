import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';  // import your entity explicitly
import { TelegramModule } from './telegram/telegram.module';
import { Faq } from './faq/faq.entity';
import { FaqModule } from './faq/faq.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nestuser',
      password: 'nestpass',
      database: 'nestdb',
      entities: [User,Faq],      
      synchronize: true,
    }),
    UsersModule,
     TelegramModule,
     FaqModule,
  ],
})
export class AppModule {}
