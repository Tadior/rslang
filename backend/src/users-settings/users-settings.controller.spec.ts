import { Test, TestingModule } from '@nestjs/testing';
import { UsersSettingsController } from './users-settings.controller';

describe('UsersSettingsController', () => {
  let controller: UsersSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersSettingsController],
    }).compile();

    controller = module.get<UsersSettingsController>(UsersSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
