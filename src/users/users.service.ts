import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id : string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 8);
  }

  async validatePassword(password: string, userPassword: string): Promise<boolean> {
    return bcrypt.compare(password, userPassword);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }


  async updateName(email: string, newName: string) {
    if (!email) {
      throw new Error('Email est undefined');
    }
    return this.prisma.user.update({
      where: { email },
      data: { name: newName },
    });
  }


}
