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
import { CreateUserWordsDto } from './dto/create-user-words.dto';
import { UpdateUserWordsDto } from './dto/update-user-words.dto';
import { UsersWordsService } from './users-words.service';

@Controller('users')
export class UsersWordsController {
  constructor(private readonly userWords: UsersWordsService) {}

  @Get(':userId/words')
  getUserWords(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.userWords.getUserWords(userId);
  }

  @Post(':userId/words/:id')
  createUserWords(
    @Param('id') id: string,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() createUserWordsDto: CreateUserWordsDto,
  ) {
    return this.userWords.createUserWords(id, userId, createUserWordsDto);
  }

  @Get(':userId/words/:id')
  getUserWordsById(
    @Param('id') id: string,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.userWords.getUserWordsById(userId, id);
  }

  @Put(':userId/words/:id')
  updateUserWords(
    @Param('id') id: string,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() updateUserWordsDto: UpdateUserWordsDto,
  ) {
    return this.userWords.updateUserWords(id, userId, updateUserWordsDto);
  }

  @Delete(':userId/words/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUserWords(
    @Param('id') id: string,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.userWords.deleteUserWords(id, userId);
  }
}
