import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UserSettingsEntity } from './entities/users-settings.entity';
import { IUserSettings } from './interfaces/interfaces';

@Injectable()
export class UsersSettingsService {
  constructor(
    @InjectRepository(UserSettingsEntity)
    private readonly userSettingsRepository: Repository<UserSettingsEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async getUserSettings(userId: string): Promise<IUserSettings[]> {
    await this.usersService.getUserById(userId);
    const userSettings: UserSettingsEntity[] =
      await this.userSettingsRepository.find({
        where: { userId: userId },
      });
    return userSettings.map((user) => user.toResponse());
  }

  async getUserSettingsById(
    userId: string,
    fullData?: boolean,
  ): Promise<IUserSettings> {
    await this.usersService.getUserById(userId);
    const userSettings: UserSettingsEntity =
      await this.userSettingsRepository.findOne({
        where: { userId: userId },
      });
    if (!userSettings) {
      throw new NotFoundException('User not found!');
    }
    return fullData ? userSettings : userSettings.toResponse();
  }

  async updateUserSettings(
    userId: string,
    updateUserSettingsDto: UpdateUserSettingsDto,
  ): Promise<IUserSettings> {
    await this.usersService.getUserById(userId);
    const { wordsPerDay, optional } = updateUserSettingsDto;
    const updatedUserSettings: IUserSettings = {
      userId: userId,
      wordsPerDay: wordsPerDay,
      optional: optional || {},
    };
    await this.userSettingsRepository.save(updatedUserSettings);
    return updatedUserSettings;
  }
}
