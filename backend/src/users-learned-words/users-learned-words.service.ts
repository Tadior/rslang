import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { UsersLearnedWordsEntity } from './entities/users-learned-words.entity';
import { ArrayContainedBy, ArrayContains, In, Any } from 'typeorm';
import { WordsService } from 'src/words/words.service';

@Injectable()
export class UsersLearnedWordsService {
  constructor(
    @InjectRepository(UsersLearnedWordsEntity)
    private readonly usersLearnedWordsEntityRepository: Repository<UsersLearnedWordsEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => WordsService))
    private readonly wordsService: WordsService,
  ) {}

  async getUserLearnWordsByUserId(userId: string) {
    const userLearnWords = await this.usersLearnedWordsEntityRepository.findOne(
      {
        where: { userId: userId },
      },
    );
    return userLearnWords ? userLearnWords.toResponse() : undefined;
  }

  async getUserLearnWordsByWordId(userId: string, id: string) {
    await this.usersService.getUserById(userId);
    const userLearnedWordsExists = await this.usersLearnedWordsEntityRepository
      .createQueryBuilder('usersLearnedWords')
      .where(
        ":learnedWords = ANY ( string_to_array(usersLearnedWords.learnedWords, ','))",
        {
          userId: userId,
          learnedWords: id,
        },
      )
      .getOne();
    return {
      userLearnedWordsExists: userLearnedWordsExists ? true : false,
    };
  }

  async updateUserLearndedWords(id: string, userId: string) {
    await this.usersService.getUserById(userId);
    await this.wordsService.getWordById(id);
    const { userLearnedWordsExists } = await this.getUserLearnWordsByWordId(
      userId,
      id,
    );
    if (userLearnedWordsExists) {
      throw new HttpException(
        'Word learned by user already exists',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const userLearnedWords = await this.getUserLearnWordsByUserId(userId);
    const updateUserLearnedWords = {
      userId: userId,
      learnedWords: userLearnedWords
        ? [...userLearnedWords.learnedWords, id]
        : [id],
    };
    await this.usersLearnedWordsEntityRepository.save(updateUserLearnedWords);
    return updateUserLearnedWords;
  }

  async deleteUserLearndedWords(id: string, userId: string) {
    await this.wordsService.getWordById(id);
    const userLearnedWords = await this.usersLearnedWordsEntityRepository
      .createQueryBuilder('usersLearnedWords')
      .where(
        ":learnedWords = ANY ( string_to_array(usersLearnedWords.learnedWords, ','))",
        {
          userId: userId,
          learnedWords: id,
        },
      )
      .getOne();
    if (!userLearnedWords) {
      throw new HttpException(
        `User does not have such a word with id: ${id}`,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const idx = userLearnedWords.learnedWords.indexOf(id);
    if (userLearnedWords) {
      userLearnedWords.learnedWords.splice(idx, 1);
      await this.usersLearnedWordsEntityRepository.save(userLearnedWords);
    }
  }
}
