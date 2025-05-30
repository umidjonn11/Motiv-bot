import { Module } from '@nestjs/common';
import { Bot } from 'grammy';
import { ScheduleModule } from '@nestjs/schedule';
import { BotService } from './bot.service';
import { SchedulerService } from '../handler/scheduler/scheduler.service';
import { UserModule } from '../handler/users/users.module';
import { QuotesModule } from '../handler/qoutes/qoutes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserModule,
    QuotesModule,
  ],
  providers: [
    BotService,
    SchedulerService,
    {
      provide: 'BOT',
      useFactory: () => {
        const bot = new Bot(process.env.BOT_TOKEN!);
        return bot;
      },
    },
  ],
  exports: ['BOT'],
})
export class BotModule {}