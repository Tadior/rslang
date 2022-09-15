import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsObject, IsOptional, ValidateNested } from "class-validator";

export class UpdateUserStatisticsOptionalDto {
    sprintRow: number;
    sprintAccuracy: number;
    audioRow: number;
    audioAccuracy: number;
    learnedWords: number;
    sprintNewWords: number;
    audioNewWords: number;
}

export class UpdateUserStatisticsDto {
    @IsNumber()
    @IsNotEmpty()
    learnedWords: number;
    @IsOptional()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => UpdateUserStatisticsOptionalDto)
    optional: UpdateUserStatisticsOptionalDto;
}
