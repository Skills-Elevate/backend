import { Controller, Post, Body, Get, UseGuards, Put, Request } from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req, @Body() body) {
    return this.usersService.updateName(body.email, body.newName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profil')
  async getProfil(@Request() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.usersService.findOne(userId);
  }
}
