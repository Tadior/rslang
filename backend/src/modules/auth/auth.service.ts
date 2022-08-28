import { ForbiddenException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { SignInUserDto } from "./dto/signInUser.dto";
import { IPayload, IUserSignIn, JWTResponce } from "./interfaces/interfaces";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) {}
    async validateUser(email: string, password: string): Promise<IUserSignIn> {
        const result: IUserSignIn = await this.usersService.getUserByLoginAndPassword(email, password);
        if (!result) {
            throw new ForbiddenException("User not found");
        }
        return result;
    }

    async signIn(signInUserDto: SignInUserDto): Promise<JWTResponce> {
        const result: IUserSignIn = await this.validateUser(signInUserDto.email, signInUserDto.password);
        const payload: IPayload = {
            email: result.email,
            userId: result.id,
        };
        return {
            message: "Authenticated",
            token: this.jwtService.sign(payload),
            userId: result.id,
            name: result.name,
        };
    }
}
