import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserWordsDto {
    @IsString()
    @IsNotEmpty()
    difficulty: string;
    @IsOptional()
    optional: object;
}
