import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, InlineKeyboard } from 'grammy';
import { QuotesService } from '../handler/qoutes/quotes.service';
import { UserService } from '../handler/users/users.service';

@Injectable()
export class BotService implements OnModuleInit {
  private pendingQuotes = new Map<number, boolean>();

  constructor(
    @Inject('BOT') private readonly bot: Bot,
    private readonly quotesService: QuotesService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    this.registerHandlers();
    await this.bot.start();
    console.log('Bot started successfully');
  }

  private registerHandlers() {
    // Start command
    this.bot.command('start', async (ctx) => {
      if (!ctx.from) throw new Error('No user in context');
      
      await this.userService.registerUser(ctx.from.id);
      await ctx.reply('Welcome! Please choose an option:', {
        reply_markup: new InlineKeyboard()
          .text('📝 Create new quote', 'create_quote')
          .row()
          .text('🎯 Random quote', 'random_quote')
          .row()
          .text('🏆 Top 5 quotes', 'top_quotes'),
      });
    });

    // Create quote callback
    this.bot.callbackQuery('create_quote', async (ctx) => {
      this.pendingQuotes.set(ctx.from.id, true);
      await ctx.reply('Please send your new motivational quote:');
      await ctx.answerCallbackQuery();
    });

    // Handle text messages for quotes
    this.bot.on('message:text', async (ctx) => {
      const userId = ctx.from?.id;
      if (userId && this.pendingQuotes.get(userId)) {
        const text = ctx.message.text;
        await this.quotesService.create(text);
        await ctx.reply('✅ Thank you! Your quote has been saved.');
        this.pendingQuotes.delete(userId);
      }
    });

    // Random quote callback
    this.bot.callbackQuery('random_quote', async (ctx) => {
      const quote = await this.quotesService.getRandom();
      if (!quote) {
        await ctx.reply('No quotes available yet.');
        return ctx.answerCallbackQuery();
      }
      
      await ctx.reply(quote.text, {
        reply_markup: new InlineKeyboard()
          .text('👍 Like', `like_${quote.id}`),
      });
      await ctx.answerCallbackQuery();
    });

    // Top quotes callback
    this.bot.callbackQuery('top_quotes', async (ctx) => {
      const topQuotes = await this.quotesService.findTop();
      if (!topQuotes.length) {
        await ctx.reply('No popular quotes yet.');
        return ctx.answerCallbackQuery();
      }
      
      let message = '🏆 Top 5 motivational quotes:\n\n';
      topQuotes.forEach((q, i) => {
        message += `${i + 1}. "${q.text}" — 👍 ${q.likes}\n`;
      });
      
      await ctx.reply(message);
      await ctx.answerCallbackQuery();
    });

    // Like callback
    this.bot.callbackQuery(/^like_(.+)$/, async (ctx) => {
      const quoteId = ctx.match[1];
      await this.quotesService.increaseLike(quoteId);
      await ctx.answerCallbackQuery({ text: '✅ Liked!' });
    });

    // Error handling
    this.bot.catch((err) => {
      console.error('Bot error:', err);
    });
  }
}