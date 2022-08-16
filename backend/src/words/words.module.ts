import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsEntity } from './entities/words.entity';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';

@Module({
  imports: [TypeOrmModule.forFeature([WordsEntity])],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
