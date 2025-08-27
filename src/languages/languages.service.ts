import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './language.entity';
import { CreateLanguageDto } from './dto/create-language.dto';

@Injectable()
export class LanguagesService implements OnModuleInit {
  constructor(
    @InjectRepository(Language) private readonly repo: Repository<Language>,
  ) {}

  async create(dto: CreateLanguageDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll() {
    return this.repo.find();
  }

  async findByCode(code: string) {
    return this.repo.findOne({ where: { code } });
  }

  async findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  
    // Seed default Ethiopian languages if not exist
   
  async onModuleInit() {
    const defaultLanguages: CreateLanguageDto[] = [
      { name: 'Amharic', code: 'amha' },
      { name: 'Oromifa', code: 'oro' },
      { name: 'Tigrinya', code: 'ti' },
      { name: 'Somali', code: 'so' },
      { name: 'English', code: 'en' }, // keep English as default
    ];

    for (const lang of defaultLanguages) {
      const exists = await this.findByCode(lang.code);
      if (!exists) {
        await this.create(lang);
      }
    }
  }
}
