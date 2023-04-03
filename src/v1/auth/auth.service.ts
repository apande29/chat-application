import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginDto } from 'src/utils/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from '../user/user.service';
import { HashUtility } from 'src/utils/crypto/encrypt';
import { ApiResponseHandler } from 'src/utils/helpers/ApiResponseHandler';
import { IApiResponse } from 'src/utils/interfaces/global.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly apiResponseHandler: ApiResponseHandler,
  ) {}

  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<IApiResponse<User>> {
    try {
      const user = await this.userService.createUser(createUserDto);
      delete user.password;
      return this.apiResponseHandler.handleSuccess(
        'Successfully registered user',
        user,
        HttpStatus.OK,
      );
    } catch (error) {
      return this.apiResponseHandler.handleFailed(
        error.message,
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async authenticateUser(loginDto: LoginDto): Promise<IApiResponse<any>> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (user) {
      const isMatched = await new HashUtility().compare(
        loginDto.password,
        user.password,
      );
      if (isMatched) {
        const loginToken = await this.login(user);
        return this.apiResponseHandler.handleSuccess(
          'Successfully logged In',
          loginToken,
          HttpStatus.OK,
        );
      }
    }
    return this.apiResponseHandler.handleFailed(
      'Wrong Credentials provided',
      '',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async validateUser(payload): Promise<User> {
    const user = await this.userService.getUserByID(payload.id);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
