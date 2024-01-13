import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './models/dto/user-login.dto';
import { User } from 'src/users/models/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: UserLoginDto) {
    const user = await this.validateUser(authLoginDto);

    const payload = {
      userEmail: user.email,
    };

    const refreshTokenPayload = {
      userEmail: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refresh_token: this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '7d',
      }),
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const decodedRefreshToken = this.jwtService.verify(refreshToken);
    const user = await this.usersService.findUserByEmail(
      decodedRefreshToken.userEmail,
    );

    const payload = {
      userEmail: user.email,
    };

    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<User> {
    const { email, password } = userLoginDto;

    const user = await this.usersService.findUserByEmail(email);
    if (!(await user.validatePassword(password))) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
