import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatisticEntity } from './entities/users-statistic.entity';
import { UsersStatisticController } from './users-statistic.controller';
import { UsersStatisticService } from './users-statistic.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserStatisticEntity])],
  controllers: [UsersStatisticController],
  providers: [UsersStatisticService],
})
export class UsersStatisticModule {}
