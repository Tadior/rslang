import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UpdateUserStatisticsDto } from './dto/update-user-statisctic.dto';
import { UserStatisticEntity } from './entities/users-statistic.entity';
import { IUserStatistics } from './interfaces/interfaces';

@Injectable()
export class UsersStatisticService {
  constructor(
    @InjectRepository(UserStatisticEntity)
    private readonly userStatisticRepository: Repository<UserStatisticEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async getUserStatistics(userId: string): Promise<IUserStatistics[]> {
    await this.usersService.getUserById(userId);
    const userStatistics: UserStatisticEntity[] =
      await this.userStatisticRepository.find({
        where: { userId: userId },
      });
    return userStatistics.map((user) => user.toResponse());
  }

  async getUserStatisticsById(
    userId: string,
    fullData?: boolean,
  ): Promise<IUserStatistics> {
    await this.usersService.getUserById(userId);
    const userStatistics: UserStatisticEntity =
      await this.userStatisticRepository.findOne({
        where: { userId: userId },
      });
    if (!userStatistics) {
      throw new NotFoundException('User not found!');
    }
    return fullData ? userStatistics : userStatistics.toResponse();
  }

  async updateUseStatistics(
    userId: string,
    updateUserStatisticsDto: UpdateUserStatisticsDto,
  ): Promise<IUserStatistics> {
    await this.usersService.getUserById(userId);
    const { learnedWords, optional } = updateUserStatisticsDto;
    const updatedUserStatistics: IUserStatistics = {
      userId: userId,
      learnedWords: learnedWords,
      optional: optional || {},
    };
    await this.userStatisticRepository.save(updatedUserStatistics);
    return {
      learnedWords: updatedUserStatistics.learnedWords,
      optional: updateUserStatisticsDto.optional,
    };
  }
}
