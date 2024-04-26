import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto, userId: string) {
    if (!createMessageDto.channelId) {
      throw new BadRequestException('ChannelId is required');
    }

    const channel = await this.prisma.channel.findUnique({
      where: { id: createMessageDto.channelId },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with id ${createMessageDto.channelId} not found`);
    }

    const message = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        author: { connect: { id: userId } },
        channel: { connect: { id: createMessageDto.channelId } },
      },
    });

    if (!message) {
      throw new NotFoundException(`Error creating message`);
    }

    return message;
  }
}