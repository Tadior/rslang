import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserWordsDto } from './dto/create-user-words.dto';
import { UserWordsEntity } from './entities/users-words.entity';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserWordsDto } from './dto/update-user-words.dto';

@Injectable()
export class UsersWordsService {
  constructor(
    @InjectRepository(UserWordsEntity)
    private readonly userWordsRepository: Repository<UserWordsEntity>,
  ) {}

  async getUserWords(userId: string) {
    const userWords = await this.userWordsRepository.find({
      where: { userId: userId },
    });
    if (!userWords) {
      throw new NotFoundException('User words not found');
    }
    return userWords.map((user) => user.toResponse());
  }

  async createUserWords(
    id: string,
    userId: string,
    createUserWordsDto: CreateUserWordsDto,
  ) {
    const newUserWord = {
      id: uuidv4(),
      wordId: id,
      userId: userId,
      difficulty: createUserWordsDto.difficulty,
      optional: createUserWordsDto.optional || {},
    };

    const isUserWordExist: boolean = await this.checkUserWord(
      newUserWord.wordId,
    );
    if (isUserWordExist) {
      throw new HttpException(
        'Such user word already exists',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const createdUserWords = await this.userWordsRepository.create(newUserWord);
    return (await this.userWordsRepository.save(createdUserWords)).toResponse();
  }

  async checkUserWord(wordId: string): Promise<boolean> {
    const word = await this.userWordsRepository.findOne({
      where: { wordId: wordId },
    });
    if (!word) {
      return false;
    }
    return true;
  }

  async getUserWordsById(userId: string, wordId: string, fullData?: boolean) {
    const userWords = await this.userWordsRepository.findOne({
      where: { userId: userId, wordId: wordId },
    });
    if (!userWords) {
      throw new NotFoundException('User or word not found');
    }
    return fullData ? userWords : userWords.toResponse();
  }

  async updateUserWords(
    wordId: string,
    userId: string,
    updateUserWordsDto: UpdateUserWordsDto,
  ) {
    const userWords = await this.getUserWordsById(userId, wordId, true);
    if (!userWords) {
      throw new NotFoundException('User or user word not found!');
    }
    const { difficulty, optional } = updateUserWordsDto;
    const updateUserWords = {
      id: userWords.id,
      wordId: wordId,
      userId: userId,
      difficulty: difficulty,
      optional: optional || {},
    };
    await this.userWordsRepository.save(updateUserWords);
    return await this.getUserWordsById(userId, wordId).then((res) => {
      return res;
    });
  }

  async deleteUserWords(wordId: string, userId: string) {
    const userWords = await this.getUserWordsById(userId, wordId, true);
    if (userWords) {
      await this.userWordsRepository.delete(userWords);
    }
  }
}
