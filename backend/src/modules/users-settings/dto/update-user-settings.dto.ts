import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateUserSettingsDto {
    @IsNumber()
    @IsNotEmpty()
    wordsPerDay: number;
    @IsOptional()
    optional: object;
}
