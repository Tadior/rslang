import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserLearnedWordsDto {
    @IsString()
    @IsNotEmpty()
    learnedWord: string;
}
