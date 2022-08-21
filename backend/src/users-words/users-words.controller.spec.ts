import { Test, TestingModule } from '@nestjs/testing';
import { UsersWordsController } from './users-words.controller';

describe('UsersWordsController', () => {
  let controller: UsersWordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersWordsController],
    }).compile();

    controller = module.get<UsersWordsController>(UsersWordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
