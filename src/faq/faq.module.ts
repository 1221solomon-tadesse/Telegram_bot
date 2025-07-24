// src/faq/faq.module.ts

import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './faq.entity'; // <-- assuming you have an entity

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService], // <-- this is important
})
export class FaqModule {}
