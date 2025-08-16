import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './language.entity';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [LanguagesService],
  controllers: [LanguagesController],
  exports: [LanguagesService],
})
export class LanguagesModule {}
