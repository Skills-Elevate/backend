import { Controller, Post, Body, Get, UseGuards, Put, Request, Req } from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiBody, ApiResponse } from "@nestjs/swagger";

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'Retrieve all users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiBody({ description: 'The new name and the email of the user', schema: { type: 'object', properties: { email: { type: 'string' }, newName: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'The user name has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(@Request() req, @Body() body) {
    return this.usersService.updateName(body.email, body.newName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponse({ status: 200, description: 'Retrieve the profile of the authenticated user' })
  async getProfile(@Request() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.usersService.findOne(userId);
  }

  @Get('is-coach')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Check if the authenticated user is a coach' })
  async isCoach(@Req() req): Promise<boolean> {
    const token = req.user;
    const userId = token.user.userId;
    return this.usersService.isUserCoach(userId);
  }
}
