import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { IUserSettings } from './interfaces/interfaces';
import { UsersSettingsService } from './users-settings.service';

@Controller('users')
export class UsersSettingsController {
  constructor(private readonly usersSettings: UsersSettingsService) {}

  @Get(':userId/settings')
  getUserStatistics(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ): Promise<IUserSettings[]> {
    return this.usersSettings.getUserSettings(userId);
  }

  @Put(':userId/settings')
  updateUserStatistics(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ): Promise<IUserSettings> {
    return this.usersSettings.updateUserSettings(userId, updateUserSettingsDto);
  }
}
