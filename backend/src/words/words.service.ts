import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordsEntity } from './entities/words.entity';
import { Repository } from 'typeorm';
import { IWord } from './interfaces/interfaces';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(WordsEntity)
    private readonly wordsRepository: Repository<WordsEntity>,
  ) {}

  async getWords(group = 0, page = 0): Promise<IWord[]> {
    const words = await this.wordsRepository.find({
      where: [{ group: group, page: page }],
    });
    return words.map((word) => word.toResponse());
  }

  async getWordById(id: string): Promise<IWord> {
    const word = await this.wordsRepository.findOne({
      where: { id: id },
    });
    if (!word) {
      throw new NotFoundException('Word not found');
    }
    return word.toResponse();
  }
}
