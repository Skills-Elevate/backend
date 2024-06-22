import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: UserLoginDto) {
    const user = await this.validateUser(authLoginDto);
    const roles = await this.usersService.getUserRoles(user.id);

    console.log(`Roles for user ${user.email}: ${roles}`);

    const payload = {
      userId: user.id,
      userEmail: user.email,
      roles: roles,
    };

    const refreshTokenPayload = {
      userId: user.id,
      userEmail: user.email,
      roles: roles,
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refresh_token: this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '7d',
      }),
    };
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<User> {
    const { email, password } = userLoginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!(await this.usersService.validatePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
