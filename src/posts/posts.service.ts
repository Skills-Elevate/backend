import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
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

  async update(id: string, updatePostDto: UpdatePostDto) {
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });

    if (!updatedPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return "Post successfully updated";
  }

  async remove(id: string) {
    const deletedPost = await this.prisma.post.delete({
      where: { id },
    });

    if (!deletedPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return "Post successfully deleted";
  }
}
