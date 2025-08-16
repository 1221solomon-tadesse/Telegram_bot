import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './language.entity';
import { CreateLanguageDto } from './dto/create-language.dto';

@Injectable()
export class LanguagesService {
  constructor(@InjectRepository(Language) private repo: Repository<Language>) {}

  create(dto: CreateLanguageDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find();
  }

  findByCode(code: string) {
    return this.repo.findOne({ where: { code } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
