import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Bot, InlineKeyboard } from 'grammy';
import { UserService } from '../users/users.service';
import { QuotesService } from '../qoutes/quotes.service';

@Injectable()
export class SchedulerService {
  constructor(
    @Inject('BOT') private readonly bot: Bot,
    private readonly userService: UserService,
    private readonly quotesService: QuotesService,
  ) {}

  @Cron('0 9 * * *') 
  async sendDailyQuote() {
    try {
      const quote = await this.quotesService.getRandom();
      if (!quote) {
        console.log('No quotes available for daily message');
        return;
      }

      const users = await this.userService.getAllUsers();
      for (const user of users) {
        try {
          await this.bot.api.sendMessage(user.chatId, quote.text, {
            reply_markup: new InlineKeyboard()
              .text('👍 Like', `like_${quote.id}`),
          });
        } catch (err) {
          console.error(`Failed to send message to user ${user.chatId}:`, err);
        }
      }
    } catch (err) {
      console.error('Error in daily quote scheduler:', err);
    }
  }
}