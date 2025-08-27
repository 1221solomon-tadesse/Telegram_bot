import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as TelegramBot from 'node-telegram-bot-api';
import { Language } from '../languages/language.entity';
import { Question } from '../quations/question.entity';
import { Translation } from '../translations/translation.entity';
import { TelegramUser } from '../telegram-users/telegram-user.entity';
@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private userSessions: Map<number, string>; // track steps per chat
  constructor(
    @InjectRepository(Language) private languageRepo: Repository<Language>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Translation) private translationRepo: Repository<Translation>,
    @InjectRepository(TelegramUser) private userRepo: Repository<TelegramUser>,
  ) {
    this.userSessions = new Map();
  }
  onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');
    this.bot = new TelegramBot(token, { polling: true });
    this.bot.setMyCommands([
  { command: "start", description: "Start the bot" },
]);
    // Step 1: /start
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const telegramId = String(chatId);

      let user = await this.userRepo.findOne({ where: { telegramId } });

      if (user && user.firstName && user.lastName) {
        // ✅ user already registered → greet & skip name request
        await this.bot.sendMessage(chatId, `👋 Welcome back ${user.firstName} ${user.lastName}!`);
        return this.askLanguage(chatId);
      }

      if (!user) {
        // create placeholder user
        user = this.userRepo.create({
          telegramId,
          username: msg.from.username,
        });
        await this.userRepo.save(user);
      }

      // ask for first name
      await this.bot.sendMessage(chatId, '👋 Welcome! Please enter your *First Name*:', {
        parse_mode: 'Markdown',
      });
      this.userSessions.set(chatId, 'ask_first_name');
    });

    // Step 2: handle messages for registration flow
    this.bot.on('message', async (msg: any) => {
      const chatId = msg.chat.id;
      const step = this.userSessions.get(chatId);
      const telegramId = String(chatId);
      const user = await this.userRepo.findOne({ where: { telegramId } });

      if (!user) return; // safety check

      if (step === 'ask_first_name') {
        user.firstName = msg.text.trim();
        await this.userRepo.save(user);

        await this.bot.sendMessage(chatId, 'Great ✅ Now please enter your *Last Name*:', {
          parse_mode: 'Markdown',
        });
        this.userSessions.set(chatId, 'ask_last_name');
        return;
      }

      if (step === 'ask_last_name') {
        user.lastName = msg.text.trim();
        await this.userRepo.save(user);
        await this.bot.sendMessage(chatId, `✅ Thanks, ${user.firstName} ${user.lastName}!`);
        this.userSessions.delete(chatId);
        // move to language selection
        return this.askLanguage(chatId);
      }
    });

    // Step 3: handle callback for language & question selection
    this.bot.on('callback_query', async (callback) => {
      const chatId = callback.message.chat.id;
      const data = callback.data;

      if (data.startsWith('lang_')) {
        const langCode = data.split('lang_')[1];

        if (langCode === 'en') {
          const questions = await this.questionRepo.find({
            where: { language: { code: 'en' } },
          });
          if (!questions.length) return this.bot.sendMessage(chatId, '⚠️ No English questions found.');

          const options = {
            reply_markup: {
              inline_keyboard: questions.map((q) => [
                { text: q.title, callback_data: `q_en_${q.id}` },
              ]),
            },
          };
          return this.bot.sendMessage(chatId, '❓ Select a question:', options);
        }

        const translations = await this.translationRepo.find({
          where: { language: { code: langCode } },
          relations: ['question', 'language'],
        });
        if (!translations.length) return this.bot.sendMessage(chatId, '⚠️ No translated questions found.');

        const options = {
          reply_markup: {
            inline_keyboard: translations.map((t) => [
              { text: t.title, callback_data: `q_tr_${t.id}` },
            ]),
          },
        };
        return this.bot.sendMessage(chatId, '❓ Select a question:', options);
      }

      if (data.startsWith('q_en_')) {
        const qId = Number(data.split('_')[2]);
        const question = await this.questionRepo.findOne({ where: { id: qId } });
        if (!question) return this.bot.sendMessage(chatId, '❌ Question not found.');
        return this.bot.sendMessage(chatId, `💡 Answer: ${question.content}`);
      }

      if (data.startsWith('q_tr_')) {
        const tId = Number(data.split('_')[2]);
        const translation = await this.translationRepo.findOne({ where: { id: tId } });
        if (!translation) return this.bot.sendMessage(chatId, '❌ Translation not found.');
        return this.bot.sendMessage(chatId, `💡 Answer: ${translation.content}`);
      }
    });
  }

  private async askLanguage(chatId: number) {
    const languages = await this.languageRepo.find();
    if (!languages.length) return this.bot.sendMessage(chatId, 'No languages available.');

    const options = {
      reply_markup: {
        inline_keyboard: languages.map((lang) => [
          { text: lang.name, callback_data: `lang_${lang.code}` },
        ]),
      },
    };
    return this.bot.sendMessage(chatId, '🌍 Select your language:', options);
  }

  async sendManualMessage(chatId: number, text: string) {
    if (!this.bot) throw new Error('Bot not initialized');
    return this.bot.sendMessage(chatId, text);
  }
   
   
}
