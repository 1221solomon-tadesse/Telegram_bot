import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { FaqModule } from '../faq/faq.module';

@Module({
  imports: [FaqModule], 
  providers: [TelegramService],
})
export class TelegramModule {}
