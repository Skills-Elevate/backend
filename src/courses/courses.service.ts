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

  async create(createCourseDto: CreateCourseDto, userId: string) {
    return this.prisma.course.create({
      data: {
        name : createCourseDto.name,
        description : createCourseDto.description,
        price : createCourseDto.price,
        imageUrl : createCourseDto.imageUrl,
        authorId : userId
      }
    });
  }

  async findOne(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: id,
      },
    });
    if (!course) {
      return null;
    }
    const channels = await this.prisma.channel.findMany({
      where: {
        courseId: id,
        ChannelMembership: {
          some: {
            user: {
              id: userId,
            },
            hasAcceptedAccess: true,
          },
        },
      },
    });
    return {
      ...course,
      channels
    };
  }

  async findAllCoursesByCoach(userId: string) {
    return this.prisma.course.findMany({
      where: {
        authorId: userId,
      },
    });
  }

  async update(courseId: string, updateCourseDto: CreateCourseDto, userId: string) {
    const existingCourse = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      throw new Error('Course not found');
    }

    // Check if the userId matches the course's authorId
    if (existingCourse.authorId !== userId) {
      console.log(`User ${userId} not authorized to update course ${courseId}`);
      throw new Error('You are not authorized to update this course');
    }

    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        name: updateCourseDto.name,
        description: updateCourseDto.description,
        price: updateCourseDto.price,
        imageUrl: updateCourseDto.imageUrl,
      },
    });
  }

}
