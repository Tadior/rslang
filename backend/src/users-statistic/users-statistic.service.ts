import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserWordsDto } from 'src/users-words/dto/update-user-words.dto';
import { Repository } from 'typeorm';
import { UpdateUserStatisticsDto } from './dto/update-user-statisctic.dto';
import { UserStatisticEntity } from './entities/users-statistic.entity';

@Injectable()
export class UsersStatisticService {
  constructor(
    @InjectRepository(UserStatisticEntity)
    private readonly userStatisticRepository: Repository<UserStatisticEntity>,
  ) {}

  async getUserStatistics(userId: string) {
    const userStatistics = await this.userStatisticRepository.find({
      where: { userId: userId },
    });
    return userStatistics.map((user) => user.toResponse());
  }

  async getUserStatisticsById(userId: string, fullData?: boolean) {
    const userStatistics = await this.userStatisticRepository.findOne({
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
  ) {
    const { learnedWords, optional } = updateUserStatisticsDto;
    const updatedUserStatistics = {
      userId: userId,
      learnedWords: learnedWords,
      optional: optional || {},
    };
    await this.userStatisticRepository.save(updatedUserStatistics);
    return await this.getUserStatisticsById(userId).then((res) => {
      return res;
    });
  }
}
