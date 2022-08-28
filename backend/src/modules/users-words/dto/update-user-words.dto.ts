import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserWordsDto {
  @IsString()
  @IsNotEmpty()
  difficulty: string;
  @IsOptional()
  optional: object;
}
