import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { FaqService } from '../faq/faq.service';
import { Faq } from '../faq/faq.entity';
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

    this.bot.start(async (ctx) => {
      const faqs = await this.faqService.findAll();
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

    // Delay registering actions until FAQs are available
    const faqs: Faq[] = await this.faqService.findAll();
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

    this.bot.launch();
    console.log('🤖 Telegram bot is up and running...');
  }
}
