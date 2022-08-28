import { Controller, Get, Param, Req } from '@nestjs/common';
import { IGetWordsRequest, IWord } from './interfaces/interfaces';
import { WordsService } from './words.service';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}
  @Get()
  getWords(@Req() req: IGetWordsRequest): Promise<IWord[]> {
    return this.wordsService.getWords(req.query.group, req.query.page);
  }

  @Get(':words')
  async getById(@Param('words') id: string): Promise<IWord> {
    return this.wordsService.getWordById(id);
  }
}
