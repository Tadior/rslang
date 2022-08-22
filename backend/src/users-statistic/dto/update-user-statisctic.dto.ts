import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserStatisticsDto {
  @IsNumber()
  @IsNotEmpty()
  learnedWords: number;
  @IsOptional()
  optional: object;
}
