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
    // Récupérer le cours avec l'ID spécifié
    const course = await this.prisma.course.findUnique({
      where: {
        id: id,
      },
    });

    // // Si le cours n'existe pas, renvoyer null
    // if (!course) {
    //   return null;
    // }
    //
    // // Récupérer le premier canal associé à ce cours et accessible à l'utilisateur
    // const channel = await this.prisma.channel.findFirst({
    //   where: {
    //     courseId: id,
    //     ChannelMembership: {
    //       some: {
    //         user: {
    //           id: userId,
    //         },
    //         hasAcceptedAccess: true,
    //       },
    //     },
    //   },
    // });

    // Retourner le cours avec le canal accessible, ou null si aucun canal n'est trouvé
    // return {
    //   ...course,
    //   channel: channel || null
    // };

    return course
  }
}
