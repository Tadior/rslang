import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8, { message: 'The min length of password is 8 ' })
  @MaxLength(20, {
    message: "The password can't accept more than 20 characters ",
  })
  @IsNotEmpty()
  password: string;
}
