import { Module } from '@nestjs/common';
import { Bot } from 'grammy';
import { ScheduleModule } from '@nestjs/schedule';
import { BotService } from './bot.service';
import { SchedulerService } from '../handler/scheduler/scheduler.service';
import { UserModule } from '../handler/users/users.module';
import { QuotesModule } from '../handler/qoutes/qoutes.module';

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
        const bot = new Bot(process.env.BOT_TOKEN || "7775297919:AAG_Chq9jPWfc8MAZkAM1gB_JWbD8-krsOw");
        return bot;
      },
    },
  ],
  exports: ['BOT'],
})
export class BotModule {}