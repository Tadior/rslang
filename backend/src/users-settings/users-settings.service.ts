import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UserSettingsEntity } from './entities/users-settings.entity';

@Injectable()
export class UsersSettingsService {
  constructor(
    @InjectRepository(UserSettingsEntity)
    private readonly userSettingsRepository: Repository<UserSettingsEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async getUserSettings(userId: string) {
    await this.usersService.getUserById(userId);
    const userSettings = await this.userSettingsRepository.find({
      where: { userId: userId },
    });
    return userSettings.map((user) => user.toResponse());
  }

  async getUserSettingsById(userId: string, fullData?: boolean) {
    await this.usersService.getUserById(userId);
    const userSettings = await this.userSettingsRepository.findOne({
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
  ) {
    await this.usersService.getUserById(userId);
    const { wordsPerDay, optional } = updateUserSettingsDto;
    const updatedUserSettings = {
      userId: userId,
      wordsPerDay: wordsPerDay,
      optional: optional || {},
    };
    await this.userSettingsRepository.save(updatedUserSettings);
    return await this.getUserSettingsById(userId, true).then((res) => {
      return res;
    });
  }
}
