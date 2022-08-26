import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserWordsDto } from 'src/users-words/dto/create-user-words.dto';
import { UpdateUserWordsDto } from 'src/users-words/dto/update-user-words.dto';
import { UsersWordsService } from 'src/users-words/users-words.service';
import { UpdateUserLearnedWordsDto } from './dto/update-user-learned-words.dto';
import { UsersLearnedWordsService } from './users-learned-words.service';

@Controller('users')
export class UsersLearnedWordsController {
  constructor(private readonly userLearnedWords: UsersLearnedWordsService) {}

  @Get(':userId/learnedWords')
  getUserWords(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.userLearnedWords.getUserLearnWordsByUserId(userId);
  }

  @Get(':userId/learnedWords/:id')
  getUserLearnWordsById(
    @Param('id') id: string,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.userLearnedWords.getUserLearnWordsByWordId(userId, id);
  }

  @Put(':userId/learnedWords/:id')
  updateUserLearnedWords(
    @Param('id') id: string,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.userLearnedWords.updateUserLearndedWords(id, userId);
  }

  @Delete(':userId/learnedWords/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUserWords(
    @Param('id') id: string,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.userLearnedWords.deleteUserLearndedWords(id, userId);
  }
}
