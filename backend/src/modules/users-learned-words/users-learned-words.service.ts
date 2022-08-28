import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { WordsService } from "../words/words.service";
import { UsersLearnedWordsEntity } from "./entities/users-learned-words.entity";
import { IUserLearnedWords, IUserLearnedWordsExists } from "./interfaces/interfaces";

@Injectable()
export class UsersLearnedWordsService {
    constructor(
        @InjectRepository(UsersLearnedWordsEntity)
        private readonly usersLearnedWordsEntityRepository: Repository<UsersLearnedWordsEntity>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => WordsService))
        private readonly wordsService: WordsService
    ) {}

    async getUserLearnWordsByUserId(userId: string): Promise<IUserLearnedWords> {
        const userLearnWords: UsersLearnedWordsEntity = await this.usersLearnedWordsEntityRepository.findOne({
            where: { userId: userId },
        });
        if (!userLearnWords) {
            return undefined;
        }
        return userLearnWords.toResponse();
    }

    async getUserLearnWordsByWordId(userId: string, id: string): Promise<IUserLearnedWordsExists> {
        await this.usersService.getUserById(userId);
        const userLearnedWordsExists: IUserLearnedWords = await this.usersLearnedWordsEntityRepository
            .createQueryBuilder("usersLearnedWords")
            .where(
                `
        :userId = usersLearnedWords.userId 
        `,
                {
                    userId: userId,
                }
            )
            .andWhere(
                `
        :learnedWords = ANY ( string_to_array(usersLearnedWords.learnedWords, ',')) 
        `,
                {
                    learnedWords: id,
                }
            )
            .getOne();
        return {
            userLearnedWordsExists: userLearnedWordsExists ? true : false,
        };
    }

    async updateUserLearndedWords(id: string, userId: string): Promise<IUserLearnedWords> {
        await this.wordsService.getWordById(id);
        const { userLearnedWordsExists } = await this.getUserLearnWordsByWordId(userId, id);
        if (userLearnedWordsExists) {
            throw new HttpException("Word learned by user already exists", HttpStatus.EXPECTATION_FAILED);
        }
        const userLearnedWords: IUserLearnedWords = await this.getUserLearnWordsByUserId(userId);
        const updateUserLearnedWords = {
            userId: userId,
            learnedWords: userLearnedWords ? [...userLearnedWords.learnedWords, id] : [id],
        };
        await this.usersLearnedWordsEntityRepository.save(updateUserLearnedWords);
        return updateUserLearnedWords;
    }

    async deleteUserLearndedWords(id: string, userId: string): Promise<void> {
        await this.wordsService.getWordById(id);
        const userLearnedWords: IUserLearnedWords = await this.usersLearnedWordsEntityRepository
            .createQueryBuilder("usersLearnedWords")
            .where(":learnedWords = ANY ( string_to_array(usersLearnedWords.learnedWords, ','))", {
                userId: userId,
                learnedWords: id,
            })
            .getOne();
        if (!userLearnedWords) {
            throw new HttpException(`User does not have such a word with id: ${id}`, HttpStatus.EXPECTATION_FAILED);
        }
        const idx: number = userLearnedWords.learnedWords.indexOf(id);
        if (userLearnedWords) {
            userLearnedWords.learnedWords.splice(idx, 1);
            await this.usersLearnedWordsEntityRepository.save(userLearnedWords);
        }
    }
}
