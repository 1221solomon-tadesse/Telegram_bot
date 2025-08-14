import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { FaqService } from '../faq/faq.service';
import { FAQ } from '../faq/faq.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;

  constructor(private readonly faqService: FaqService) {}

  async onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error('Telegram bot token missing in env!');
      return;
    }

    this.bot = new Telegraf(token);

    // Start command
    this.bot.start(async (ctx) => {
      const faqs = await this.faqService.findAll();
      if (!faqs.length) {
        return ctx.reply('No FAQs available at the moment.');
      }

      ctx.reply(
        'Choose a topic:',
        Markup.inlineKeyboard(
          faqs.map((faq) =>
            Markup.button.callback(faq.question, `faq_${faq.id}`),
          ),
          { columns: 1 },
        ),
      );
    });

    // Register FAQ actions
    const faqs: FAQ[] = await this.faqService.findAll();
    faqs.forEach((faq) => {
      this.bot.action(`faq_${faq.id}`, async (ctx) => {
        ctx.answerCbQuery();

        if (faq.type === 'video') {
          await ctx.replyWithVideo(faq.answer);
        } else {
          await ctx.reply(faq.answer);
        }
      });
    });

    await this.bot.launch();
    console.log('🤖 Telegram bot is up and running...');
  }
}
