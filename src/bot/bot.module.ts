import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined in the environment variables');
}

export const bot = new Telegraf(token);