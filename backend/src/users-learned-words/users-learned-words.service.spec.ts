import { Test, TestingModule } from '@nestjs/testing';
import { UsersLearnedWordsService } from './users-learned-words.service';

describe('UsersLearnedWordsService', () => {
  let service: UsersLearnedWordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersLearnedWordsService],
    }).compile();

    service = module.get<UsersLearnedWordsService>(UsersLearnedWordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
