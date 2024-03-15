import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: UserLoginDto) {
    const user = await this.validateUser(authLoginDto);

    const payload = {
      userId: user.id,
      userEmail: user.email
    };

    const refreshTokenPayload = {
      userId: user.id,
      userEmail: user.email
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refresh_token: this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '7d',
      }),
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decodedRefreshToken = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(decodedRefreshToken.userEmail);

      const payload = {
        userId: user.id,
        userEmail: user.email
      };

      return this.jwtService.sign(payload, { expiresIn: '1d' });
    } catch (error) {
      console.error('JWT Verification Error during refreshAccessToken:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<User> {
    const { email, password } = userLoginDto;

    const user = await this.usersService.findOne(email);
    if (!(await this.usersService.validatePassword(password, user.password))) {
      throw new UnauthorizedException();
    }
    return user;
  }
}