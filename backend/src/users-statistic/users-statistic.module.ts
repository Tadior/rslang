import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UserStatisticEntity } from './entities/users-statistic.entity';
import { UsersStatisticController } from './users-statistic.controller';
import { UsersStatisticService } from './users-statistic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserStatisticEntity]),
    forwardRef(() => UsersModule),
  ],
  controllers: [UsersStatisticController],
  providers: [UsersStatisticService],
})
export class UsersStatisticModule {}
