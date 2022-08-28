import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserStatisticsDto {
  @IsNumber()
  @IsNotEmpty()
  learnedWords: number;
  @IsOptional()
  optional: object;
}
