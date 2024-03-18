import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(name?: string) {
    return this.prisma.course.findMany({
      where: {
        name: name ? {
          contains: name,
        } : undefined,
      },
    });
  }
}
