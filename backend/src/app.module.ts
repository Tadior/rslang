import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './ormconfig';
import { WordsModule } from './words/words.module';
import { UsersModule } from './users/users.module';
import { UsersWordsModule } from './users-words/users-words.module';
import { UsersStatisticModule } from './users-statistic/users-statistic.module';
import { UsersSettingsModule } from './users-settings/users-settings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    TypeOrmModule.forRoot(config),
    WordsModule,
    UsersModule,
    UsersWordsModule,
    UsersStatisticModule,
    UsersSettingsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
