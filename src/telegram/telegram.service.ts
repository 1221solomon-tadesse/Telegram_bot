import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as TelegramBot from 'node-telegram-bot-api';

import { Language } from '../languages/language.entity';
import { Question } from '../quations/question.entity';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    @InjectRepository(Language)
    private languageRepo: Repository<Language>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}

  onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');
    this.bot = new TelegramBot(token, { polling: true });
  }

  // Telegram interactive methods remain as before

  // ✅ API methods for Postman
  async getLanguages() {
    return this.languageRepo.find();
  }

  async getQuestions(langId: number) {
    return this.questionRepo.find({
      where: { language: { id: langId } },
      relations: ['language'],
    });
  }

  async getAnswer(questionId: number) {
    const question = await this.questionRepo.findOne({ where: { id: questionId } });
    return question ? question.content : 'Not found';
  }

  async sendMessage(chatId: number, text: string) {
    if (!this.bot) throw new Error('Telegram bot not initialized');
    return this.bot.sendMessage(chatId, text);
  }
}