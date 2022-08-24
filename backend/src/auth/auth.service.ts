import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignInUserDto } from './dto/signInUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  async validateUser(email: string, password: string) {
    const result = await this.usersService.getUserByLoginAndPassword(
      email,
      password,
    );
    if (!result) {
      throw new ForbiddenException('User not found');
    }
    return result;
  }

  async signIn(signInUserDto: SignInUserDto) {
    const result = await this.validateUser(
      signInUserDto.email,
      signInUserDto.password,
    );
    const payload = {
      email: result.email,
      userId: result.id,
    };
    return {
      message: 'Authenticated',
      token: this.jwtService.sign(payload),
      userId: result.id,
      name: result.name,
    };
  }
}
