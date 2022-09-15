import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { WordsModule } from "../words/words.module";
import { UsersLearnedWordsEntity } from "./entities/users-learned-words.entity";
import { UsersLearnedWordsController } from "./users-learned-words.controller";
import { UsersLearnedWordsService } from "./users-learned-words.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersLearnedWordsEntity]),
        forwardRef(() => UsersModule),
        forwardRef(() => WordsModule),
    ],
    controllers: [UsersLearnedWordsController],
    providers: [UsersLearnedWordsService],
})
export class UsersLearnedWordsModule {}
