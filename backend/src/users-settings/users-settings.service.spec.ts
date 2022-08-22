import { Test, TestingModule } from '@nestjs/testing';
import { UsersSettingsService } from './users-settings.service';

describe('UsersSettingsService', () => {
  let service: UsersSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersSettingsService],
    }).compile();

    service = module.get<UsersSettingsService>(UsersSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
