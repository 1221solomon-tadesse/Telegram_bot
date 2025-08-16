import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get('languages')
  async getLanguages() {
    return this.telegramService.getLanguages();
  }

  @Get('questions/:langId')
  async getQuestions(@Param('langId') langId: number) {
    return this.telegramService.getQuestions(langId);
  }

  @Get('answer/:questionId')
  async getAnswer(@Param('questionId') questionId: number) {
    return this.telegramService.getAnswer(questionId);
  }

  @Post('send')
  async sendMessage(@Body() body: { chatId: number; text: string }) {
    return this.telegramService.sendMessage(body.chatId, body.text);
  }
}
