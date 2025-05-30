import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './quote.entity';

@Injectable()
export class QuotesService {
  constructor(@InjectRepository(Quote) private quoteRepo: Repository<Quote>) {}

  async create(text: string): Promise<Quote> {
    const quote = this.quoteRepo.create({ text });
    return this.quoteRepo.save(quote);
  }
  

  async getRandom(): Promise<Quote | null> {
    const quotes = await this.quoteRepo.find();
    if (!quotes.length) return null;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  async findTop(): Promise<Quote[]> {
    return this.quoteRepo.find({
      order: { likes: 'DESC' },
      take: 5,
    });
  }

  async increaseLike(id: string): Promise<void> {
    await this.quoteRepo.increment({ id }, 'likes', 1);
  }
}
