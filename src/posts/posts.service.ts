import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto, userId: string) {
    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: userId
      }
    });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const updatedPost = await this.prisma.post.update({
      where: {
        id,
        authorId: userId,
      },
      data: updatePostDto,
    });

    if (!updatedPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return "Post successfully updated";
  }

  async remove(id: string, userId: string) {
    const deletedPost = await this.prisma.post.delete({
      where: {
        id,
        authorId: userId,
      },
    });

    if (!deletedPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return "Post successfully deleted";
  }
}
