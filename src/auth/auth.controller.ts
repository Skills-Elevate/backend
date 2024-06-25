import { Controller, Body, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiBody, ApiResponse } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() authLoginDto: UserLoginDto) {
    console.log('AuthLoginDto:', authLoginDto);
    return this.authService.login(authLoginDto);
  }

  @Post('refresh_token')
  @ApiBody({ schema: { type: 'object', properties: { refresh_token: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Access token refreshed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid refresh token.' })
  async refreshToken(@Body() body: { refresh_token: string }) {
    const newAccessToken = await this.authService.refreshAccessToken(body.refresh_token);
    return { access_token: newAccessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'User is authorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async CheckAuthorizedAuth() {
    return 'You have authorized!';
  }
}
