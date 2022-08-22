import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserStatisticsDto } from 'src/users-statistic/dto/update-user-statisctic.dto';
import { Repository } from 'typeorm';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UserSettingsEntity } from './entities/users-settings.entity';

@Injectable()
export class UsersSettingsService {
  constructor(
    @InjectRepository(UserSettingsEntity)
    private readonly userSettingsRepository: Repository<UserSettingsEntity>,
  ) {}

  async getUserSettings(userId: string) {
    const userSettings = await this.userSettingsRepository.find({
      where: { userId: userId },
    });
    return userSettings.map((user) => user.toResponse());
  }

  async getUserSettingsById(userId: string, fullData?: boolean) {
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
