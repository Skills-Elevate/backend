import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from "./dto/create-course.dto";

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(queryParams: { name?: string; category?: string }) {
    const { name, category } = queryParams;
    if (!name && !category) {
      return this.prisma.course.findMany();
    }
    return this.prisma.course.findMany({
      where: {
        OR: [
          name ? { name: { contains: name } } : undefined,
          category ? { category: { contains: category } } : undefined,
        ].filter(condition => condition !== undefined),
      },
    });
  }

  async create(createCourseDto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        name : createCourseDto.name,
        description : createCourseDto.description,
        price : createCourseDto.price,
        imageUrl : createCourseDto.imageUrl,
        author : createCourseDto.author
      }
    });
  }

}
