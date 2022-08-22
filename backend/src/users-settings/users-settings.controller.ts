import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { UpdateUserStatisticsDto } from 'src/users-statistic/dto/update-user-statisctic.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UsersSettingsService } from './users-settings.service';

@Controller('users')
export class UsersSettingsController {
  constructor(private readonly usersSettings: UsersSettingsService) {}

  @Get(':userId/settings')
  getUserStatistics(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.usersSettings.getUserSettings(userId);
  }

  @Put(':userId/settings')
  updateUserStatistics(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.usersSettings.updateUserSettings(userId, updateUserSettingsDto);
  }
}
