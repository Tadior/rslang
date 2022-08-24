import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signInUser.dto';

@Controller('signin')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post()
  async signin(@Body() signInUserDto: SignInUserDto) {
    return this.authService.signIn(signInUserDto);
  }
}
