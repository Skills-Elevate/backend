import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './models/dto/create-user.dto';
import {User} from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    const { password, ...result } = user;
    return result as Omit<User, 'password'>; // Cast explicitement le résultat
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany();
  }
}
