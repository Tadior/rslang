import { Test, TestingModule } from '@nestjs/testing';
import { UsersStatisticService } from './users-statistic.service';

describe('UsersStatisticService', () => {
  let service: UsersStatisticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersStatisticService],
    }).compile();

    service = module.get<UsersStatisticService>(UsersStatisticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
