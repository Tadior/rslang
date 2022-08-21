import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWordsEntity } from './entities/users-words.entity';
import { UsersWordsController } from './users-words.controller';
import { UsersWordsService } from './users-words.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserWordsEntity])],
  controllers: [UsersWordsController],
  providers: [UsersWordsService],
})
export class UsersWordsModule {}
