import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(createChannelsDto: CreateChannelDto, userId: string) {
    const { name } = createChannelsDto;

    try {
      const createdChannel = await this.prisma.channel.create({
        data: {
          name,
        },
      });

      await this.prisma.channelMembership.create({
        data: {
          user: {
            connect: { id: userId },
          },
          channel: {
            connect: { id: createdChannel.id },
          },
          hasAcceptedAccess: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error creating channel with users ${userId}`);
    }
    return { message: 'Channel successfully created' };
  }

  async findAll(userId: string, acceptedAccess: boolean) {
    const findAllChannels = await this.prisma.channel.findMany({
      where: {
        ChannelMembership: {
          some: {
            user: {
              id: userId,
            },
            hasAcceptedAccess: acceptedAccess,
          },
        },
      },
      include: {
        ChannelMembership: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!findAllChannels || findAllChannels.length === 0) {
      throw new NotFoundException(`Channels not found`);
    }
    return findAllChannels;
  }

  async findOne(id: string, userId: string) {
    const findOneChannel = await this.prisma.channel.findUnique({
      where: {
        id,
        ChannelMembership: {
          some: {
            user: {
              id: userId,
            },
            hasAcceptedAccess: true,
          },
        },
      },
      include: {
        ChannelMembership: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
        messages: true,
      },
    });
    if (!findOneChannel) {
      throw new NotFoundException(`Channel with id ${id} not found`);
    }
    // Get and Extract the current user name
    const currentUser = findOneChannel.ChannelMembership.find(
      membership => membership.userId === userId
    );
    const currentUserName = currentUser ? currentUser.user.name : null;

    return {
      ...findOneChannel,
      currentUserName: currentUserName
    };
  }

  async update(id: string, updatePostDto: UpdateChannelDto) {
    const updatedChannel = await this.prisma.channel.update({
      where: { id },
      data: updatePostDto,
    });

    if (!updatedChannel) {
      throw new NotFoundException(`Channel with id ${id} not found`);
    }
    return { message: 'Channel successfully updated' };
  }

  async remove(id: string) {
    try {
      await this.prisma.channelMembership.deleteMany({
        where: {
          channelId: id,
        },
      });

      await this.prisma.channel.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting channel with id ${id}`);
    }
    return { message: 'Channel and associated users successfully deleted' };
  }

  async joinChannel(channelId: string, userId: string) {
    try {
      await this.prisma.channelMembership.create({
        data: {
          userId: userId,
          channelId: channelId,
          hasAcceptedAccess: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error accepting access to channel with id ${channelId}`);
    }
    return { message: 'Channel and associated user successfully accepted' };
  }
}