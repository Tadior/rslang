import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/users.entity';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from './interfaces/interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUsers(): Promise<IUser[]> {
    const users: UserEntity[] = await this.userRepository.find();
    return users.map((user: UserEntity) => user.toResponse());
  }

  async getUserById(id: string): Promise<IUser> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toResponse();
  }

  async checkUserByEmail(email: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      return false;
    }
    return true;
  }

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const newUser: IUser = {
      id: uuidv4(),
      ...createUserDto,
    };
    const isUserExist: boolean = await this.checkUserByEmail(newUser.email);
    if (isUserExist) {
      throw new HttpException(
        'User with this e-mail exists',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const createdUser: UserEntity = await this.userRepository.create(newUser);
    return (await this.userRepository.save(createdUser)).toResponse();
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<IUser> {
    const user: IUser = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const { password, email } = updateUserDto;
    const updatedUser: IUser = {
      id: user.id,
      password: password,
      email: email,
    };
    await this.userRepository.save(updatedUser);
    return await this.getUserById(updatedUser.id).then((res: IUser) => {
      return res;
    });
  }

  async deleteUser(id: string): Promise<void> {
    const user: IUser = await this.getUserById(id);
    if (user) {
      await this.userRepository.delete(id);
    }
  }

  async getUserByLoginAndPassword(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email: email, password: password },
    });
    return user;
  }
}
