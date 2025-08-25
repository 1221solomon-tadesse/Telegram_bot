import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramUser } from './telegram-user.entity';

@Injectable()
export class TelegramUsersService {
  constructor(
    @InjectRepository(TelegramUser)
    private userRepo: Repository<TelegramUser>,
  ) {}

  async createOrUpdate(userData: Partial<TelegramUser>): Promise<TelegramUser> {
    let user = await this.userRepo.findOne({ where: { telegramId: userData.telegramId } });
    if (user) {
      Object.assign(user, userData); // update info
    } else {
      user = this.userRepo.create(userData); // new user
    }
    return this.userRepo.save(user);
  }

  async findAll(): Promise<TelegramUser[]> {
    return this.userRepo.find();
  }

  async countUsers(): Promise<number> {
    return this.userRepo.count();
  }

  async setActive(telegramId: string, isActive: boolean) {
    await this.userRepo.update({ telegramId }, { isActive });
    return this.userRepo.findOne({ where: { telegramId } });
  }

  async findActiveUsers(): Promise<TelegramUser[]> {
    return this.userRepo.find({ where: { isActive: true } });
  }
}
