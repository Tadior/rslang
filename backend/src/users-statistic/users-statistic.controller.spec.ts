import { Test, TestingModule } from '@nestjs/testing';
import { UsersStatisticController } from './users-statistic.controller';

describe('UsersStatisticController', () => {
  let controller: UsersStatisticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersStatisticController],
    }).compile();

    controller = module.get<UsersStatisticController>(UsersStatisticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
