import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { WordsModule } from 'src/words/words.module';
import { UsersLearnedWordsEntity } from './entities/users-learned-words.entity';
import { UsersLearnedWordsController } from './users-learned-words.controller';
import { UsersLearnedWordsService } from './users-learned-words.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersLearnedWordsEntity]),
    forwardRef(() => UsersModule),
    forwardRef(() => WordsModule),
  ],
  controllers: [UsersLearnedWordsController],
  providers: [UsersLearnedWordsService],
})
export class UsersLearnedWordsModule {}
