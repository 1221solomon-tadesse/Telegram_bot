import { Controller, Get, Param, Patch } from '@nestjs/common';
import { TelegramUsersService } from './telegram-users.service';

@Controller('telegram-users')
export class TelegramUsersController {
  constructor(private readonly usersService: TelegramUsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('count')
  async getUserCount() {
    return { total: await this.usersService.countUsers() };
  }

  @Patch(':telegramId/activate')
  async activate(@Param('telegramId') telegramId: string) {
    return this.usersService.setActive(telegramId, true);
  }

  @Patch(':telegramId/deactivate')
  async deactivate(@Param('telegramId') telegramId: string) {
    return this.usersService.setActive(telegramId, false);
  }
}
