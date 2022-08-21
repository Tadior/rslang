import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IOptional } from '../interfaces/interfaces';

export class CreateUserWordsDto {
  @IsString()
  @IsNotEmpty()
  difficulty: string;
  @IsOptional()
  optional: IOptional;
}
