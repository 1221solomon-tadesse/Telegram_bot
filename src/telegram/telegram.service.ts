import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as TelegramBot from 'node-telegram-bot-api';
import { Language } from '../languages/language.entity';
import { Question } from '../quations/question.entity';
import { Translation } from '../translations/translation.entity';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    @InjectRepository(Language)
    private languageRepo: Repository<Language>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Translation) private translationRepo: Repository<Translation>,
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
            { text: lang.name, callback_data: `lang_${lang.code}` }, // use code
          ]),
        },
      };

      await this.bot.sendMessage(chatId, '🌍 Select your language:', options);
    });

    // Step 2: Handle callback
    this.bot.on('callback_query', async (callback) => {
      const chatId = callback.message.chat.id;
      const data = callback.data;

      // LANGUAGE SELECTED
      if (data.startsWith('lang_')) {
        const langCode = data.split('lang_')[1];

        if (langCode === 'en') {
          // ✅ Fetch original English questions
          const questions = await this.questionRepo.find({
            where: { language: { code: 'en' } },
            relations: ['language'],
          });

          if (!questions.length) {
            return this.bot.sendMessage(chatId, '⚠️ No English questions found.');
          }

          const options = {
            reply_markup: {
              inline_keyboard: questions.map((q) => [
                { text: q.title, callback_data: `q_en_${q.id}` }, // mark as English question
              ]),
            },
          };

          return this.bot.sendMessage(chatId, '❓ Select a question:', options);
        }

        // ✅ Fetch translations for other languages
        const translations = await this.translationRepo.find({
          where: { language: { code: langCode } },
          relations: ['question', 'language'],
        });

        if (!translations.length) {
          return this.bot.sendMessage(chatId, '⚠️ No translated questions found for this language.');
        }

        const options = {
          reply_markup: {
            inline_keyboard: translations.map((t) => [
              { text: t.title, callback_data: `q_tr_${t.id}` }, // mark as translation
            ]),
          },
        };

        return this.bot.sendMessage(chatId, '❓ Select a question:', options);
      }

      // QUESTION SELECTED (English)
      if (data.startsWith('q_en_')) {
        const qId = Number(data.split('_')[2]);
        const question = await this.questionRepo.findOne({
          where: { id: qId },
        });

        if (!question) {
          return this.bot.sendMessage(chatId, '❌ Question not found.');
        }

        return this.bot.sendMessage(chatId, `💡 Answer: ${question.content}`);
      }

      // QUESTION SELECTED (Translated)
      if (data.startsWith('q_tr_')) {
        const tId = Number(data.split('_')[2]);
        const translation = await this.translationRepo.findOne({
          where: { id: tId },
        });

        if (!translation) {
          return this.bot.sendMessage(chatId, '❌ Translation not found.');
        }

        return this.bot.sendMessage(chatId, `💡 Answer: ${translation.content}`);
      }
    });
  }

  // ✅ Manual message sending
  async sendManualMessage(chatId: number, text: string) {
    if (!this.bot) throw new Error('Bot not initialized');
    return this.bot.sendMessage(chatId, text);
  }
}
