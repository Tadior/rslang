import { Test, TestingModule } from '@nestjs/testing';
import { UsersWordsService } from './users-words.service';

describe('UsersWordsService', () => {
  let service: UsersWordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersWordsService],
    }).compile();

    service = module.get<UsersWordsService>(UsersWordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
