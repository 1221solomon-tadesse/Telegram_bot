import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  // Example: send manual message
  @Post('send')
  async sendMessage(@Body() body: { chatId: number; text: string }) {
    return this.telegramService.sendManualMessage(body.chatId, body.text);
  }
}
