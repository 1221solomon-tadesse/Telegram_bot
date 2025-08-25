import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramUser } from './telegram-user.entity';
import { TelegramUsersService } from './telegram-users.service';
import { TelegramUsersController } from './telegram-users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramUser])],
  providers: [TelegramUsersService],
  controllers: [TelegramUsersController],
  exports: [TelegramUsersService],
})
export class TelegramUsersModule {}
