import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async registerUser(chatId: number): Promise<void> {
    const existing = await this.userRepo.findOne({ where: { chatId: String(chatId) } });
    if (!existing) {
      const user = this.userRepo.create({ chatId: String(chatId) });
      await this.userRepo.save(user);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }
}
