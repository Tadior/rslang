import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':users')
  getUserById(@Param('users', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Delete(':users')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('users', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.userService.deleteUser(id);
  }

  @Put(':users')
  updateUser(
    @Body() updatedUserDto: UpdateUserDto,
    @Param('users', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.userService.updateUser(updatedUserDto, id);
  }
}
