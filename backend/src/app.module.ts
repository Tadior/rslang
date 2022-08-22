import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './ormconfig';
import { WordsModule } from './words/words.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { UsersWordsController } from './users-words/users-words.controller';
import { UsersWordsModule } from './users-words/users-words.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersStatisticController } from './users-statistic/users-statistic.controller';
import { UsersStatisticModule } from './users-statistic/users-statistic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    TypeOrmModule.forRoot(config),
    WordsModule,
    UsersModule,
    UsersWordsModule,
    UsersStatisticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
