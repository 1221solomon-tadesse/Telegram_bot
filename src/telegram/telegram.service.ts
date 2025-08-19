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
    // Step 1: /start
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const languages = await this.languageRepo.find();
      if (!languages.length) {
        return this.bot.sendMessage(chatId, 'No languages available yet.');
      }     
      const options = {
        reply_markup: {
          inline_keyboard: languages.map((lang) => [
            { text: lang.name, callback_data: `lang_${lang.id}` },
          ]),
        },
      };
      await this.bot.sendMessage(chatId, 'Select your language:', options);
    });
    
    this.bot.on('callback_query', async (callback) => {
      const chatId = callback.message.chat.id;
      const data = callback.data;

      // LANGUAGE SELECTED
      if (data.startsWith('lang_')) {
        const langId = Number(data.split('_')[1]);
        const questions = await this.questionRepo.find({
          where: { language: { id: langId } },
          relations: ['language'],
        });

        if (!questions.length) {
          return this.bot.sendMessage(chatId, 'No questions found for this language.');
        }

        const options = {
          reply_markup: {
            inline_keyboard: questions.map((q) => [
              { text: q.title, callback_data: `q_${q.id}` },
            ]),
          },
        };

        return this.bot.sendMessage(chatId, 'Select a question:', options);
      }

      // QUESTION SELECTED
      if (data.startsWith('q_')) {
        const qId = Number(data.split('_')[1]);
        const question = await this.questionRepo.findOne({
          where: { id: qId },
          relations: ['language'],
        });

        if (!question) {
          return this.bot.sendMessage(chatId, 'Question not found.');
        }

        // Show answer
        return this.bot.sendMessage(chatId, `Answer: ${question.content ?? 'Not answered yet.'}`);
      }
    });
  }

  // ✅ Add this method for manual messages
  async sendManualMessage(chatId: number, text: string) {
    if (!this.bot) throw new Error('Bot not initialized');
    return this.bot.sendMessage(chatId, text);
  }
}
