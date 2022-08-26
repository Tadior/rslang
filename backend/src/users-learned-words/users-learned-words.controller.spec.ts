import { Test, TestingModule } from '@nestjs/testing';
import { UsersLearnedWordsController } from './users-learned-words.controller';

describe('UsersLearnedWordsController', () => {
  let controller: UsersLearnedWordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersLearnedWordsController],
    }).compile();

    controller = module.get<UsersLearnedWordsController>(
      UsersLearnedWordsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
