import { Controller, Get, Param, ParseUUIDPipe, Put, Delete, HttpCode, HttpStatus } from "@nestjs/common";
import { IUserLearnedWords, IUserLearnedWordsExists } from "./interfaces/interfaces";
import { UsersLearnedWordsService } from "./users-learned-words.service";

@Controller("users")
export class UsersLearnedWordsController {
    constructor(private readonly userLearnedWords: UsersLearnedWordsService) {}

    @Get(":userId/learnedWords")
    getUserWords(@Param("userId", new ParseUUIDPipe({ version: "4" })) userId: string): Promise<IUserLearnedWords> {
        return this.userLearnedWords.getUserLearnWordsByUserId(userId);
    }

    @Get(":userId/learnedWords/:id")
    getUserLearnWordsById(
        @Param("id") id: string,
        @Param("userId", new ParseUUIDPipe({ version: "4" })) userId: string
    ): Promise<IUserLearnedWordsExists> {
        return this.userLearnedWords.getUserLearnWordsByWordId(userId, id);
    }

    @Put(":userId/learnedWords/:id")
    updateUserLearnedWords(
        @Param("id") id: string,
        @Param("userId", new ParseUUIDPipe({ version: "4" })) userId: string
    ): Promise<IUserLearnedWords> {
        return this.userLearnedWords.updateUserLearndedWords(id, userId);
    }

    @Delete(":userId/learnedWords/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUserWords(
        @Param("id") id: string,
        @Param("userId", new ParseUUIDPipe({ version: "4" })) userId: string
    ): Promise<void> {
        return this.userLearnedWords.deleteUserLearndedWords(id, userId);
    }
}
