import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { UpdateUserStatisticsDto } from "./dto/update-user-statisctic.dto";
import { UserStatisticEntity } from "./entities/users-statistic.entity";
import { IOptional, IUserDayStatistic, IUserStatistics } from "./interfaces/interfaces";

@Injectable()
export class UsersStatisticService {
    constructor(
        @InjectRepository(UserStatisticEntity)
        private readonly userStatisticRepository: Repository<UserStatisticEntity>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) {}

    async getUserStatistics(userId: string): Promise<IUserStatistics[]> {
        await this.usersService.getUserById(userId);
        const userStatistics: UserStatisticEntity[] = await this.userStatisticRepository.find({
            where: { userId: userId },
        });
        return userStatistics.map((user) => user.toResponse());
    }

    async getUserStatisticsById(userId: string, fullData?: boolean): Promise<IUserStatistics> {
        await this.usersService.getUserById(userId);
        const userStatistics: UserStatisticEntity = await this.userStatisticRepository.findOne({
            where: { userId: userId },
        });
        if (!userStatistics) {
            return undefined;
        }
        return fullData ? userStatistics : userStatistics.toResponse();
    }

    async updateUseStatistics(
        userId: string,
        updateUserStatisticsDto: UpdateUserStatisticsDto
    ): Promise<IUserStatistics> {
        await this.usersService.getUserById(userId);
        const { learnedWords, optional } = updateUserStatisticsDto;
        const userStatisticsInDb: IUserStatistics = await this.getUserStatisticsById(userId);
        const firstKey: string = Object.keys(optional)[0];
        const newOptional: IUserDayStatistic = {};
        const keysArr: string[] = Object.keys(optional[`${firstKey}`]);
        newOptional[`${firstKey}`] = {
            sprintRow: optional[`${firstKey}`].sprintRow | 0,
            sprintAccuracy: optional[`${firstKey}`].sprintAccuracy | 0,
            audioRow: optional[`${firstKey}`].audioRow | 0,
            audioAccuracy: optional[`${firstKey}`].audioAccuracy | 0,
            learnedWords: optional[`${firstKey}`].learnedWords | 0,
            sprintNewWords: optional[`${firstKey}`].sprintNewWords | 0,
            audioNewWords: optional[`${firstKey}`].audioNewWords | 0,
        };
        if (userStatisticsInDb) {
            const userStatisticsInDbOptional: object | IOptional = userStatisticsInDb.optional;
            const userStatisticsInDbFirstKey: IUserDayStatistic = userStatisticsInDbOptional[`${firstKey}`];
            if (userStatisticsInDbFirstKey && userStatisticsInDb) {
                for (const key in userStatisticsInDbFirstKey) {
                    if (!keysArr.includes(key)) {
                        newOptional[`${firstKey}`][`${key}`] = userStatisticsInDbFirstKey[`${key}`];
                    }
                }
            }
        }
        const updatedUserStatistics: IUserStatistics = {
            userId: userId,
            learnedWords: learnedWords,
            optional: userStatisticsInDb ? { ...Object.assign(userStatisticsInDb.optional, newOptional) } : newOptional,
        };
        await this.userStatisticRepository.save(updatedUserStatistics);
        return {
            learnedWords: updatedUserStatistics.learnedWords,
            optional: updatedUserStatistics.optional,
        };
    }
}
