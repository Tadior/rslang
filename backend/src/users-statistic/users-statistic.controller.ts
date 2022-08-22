import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { UpdateUserStatisticsDto } from './dto/update-user-statisctic.dto';
import { UsersStatisticService } from './users-statistic.service';

@Controller('users')
export class UsersStatisticController {
  constructor(private readonly usersStatistic: UsersStatisticService) {}

  @Get(':userId/statistics')
  getUserStatistics(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.usersStatistic.getUserStatistics(userId);
  }

  @Put(':userId/statistics')
  updateUserStatistics(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() updateUserStatisticsDto: UpdateUserStatisticsDto,
  ) {
    return this.usersStatistic.updateUseStatistics(
      userId,
      updateUserStatisticsDto,
    );
  }
}
