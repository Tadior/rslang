import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UserWordsEntity } from './entities/users-words.entity';
import { UsersWordsController } from './users-words.controller';
import { UsersWordsService } from './users-words.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserWordsEntity]),
    forwardRef(() => UsersModule),
  ],
  controllers: [UsersWordsController],
  providers: [UsersWordsService],
})
export class UsersWordsModule {}
