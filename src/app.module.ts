import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './handler/users/users.module';
import { QuotesModule } from './handler/qoutes/qoutes.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explicitly specify the env file path
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'umidjon06',
      database: process.env.DB_NAME || 'motiv',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // safer sync setting
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    QuotesModule,
    BotModule,
    // Removed SchedulerModule as it's now integrated in BotModule
  ],
})
export class AppModule {}