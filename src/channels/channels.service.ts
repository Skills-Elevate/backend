import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(createChannelsDto: CreateChannelDto, userId: string) {
    const { courseId } = createChannelsDto;

    // Vérification de l'existence du cours avec courseId
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, name: true, authorId: true },
    });

    // Si le cours n'existe pas, lancer une exception
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const { name: courseName, authorId: courseAuthorId } = course;

    // Utilisez une transaction pour garantir que le channel ne soit pas créé si la création du channelMembership échoue
    try {
      const result = await this.prisma.$transaction(async (transactionPrisma) => {
        // Vérifie si un channel existant avec le même courseId
        const existingChannel = await transactionPrisma.channel.findFirst({
          where: {
            courseId,
          },
        });

        if (existingChannel) {
          // Vérifie si un channelMembership existe déjà pour ce channelId et userId
          const existingMembership = await transactionPrisma.channelMembership.findFirst({
            where: {
              channelId: existingChannel.id,
              userId,
            },
          });

          // Si un channelMembership existe déjà, renvoyez un message indiquant qu'il existe déjà
          if (existingMembership) {
            return { message: 'ChannelMembership already exists for user and course' };
          }

          // Créez le channelMembership pour l'utilisateur initial
          await transactionPrisma.channelMembership.create({
            data: {
              user: {
                connect: { id: userId },
              },
              channel: {
                connect: { id: existingChannel.id },
              },
              hasAcceptedAccess: true,
            },
          });

          return { message: 'ChannelMembership successfully created' };
        }

        // Créez le channel
        const createdChannel = await transactionPrisma.channel.create({
          data: {
            name: courseName,
            courseId,
          },
        });

        // Créez le channelMembership pour l'utilisateur initial
        await transactionPrisma.channelMembership.create({
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

        // Vérifiez si l'utilisateur initial n'est pas l'auteur du cours
        if (courseAuthorId !== userId) {
          // Créez le channelMembership pour l'auteur du cours
          await transactionPrisma.channelMembership.create({
            data: {
              user: {
                connect: { id: courseAuthorId },
              },
              channel: {
                connect: { id: createdChannel.id },
              },
              hasAcceptedAccess: true,
            },
          });
        }

        return { message: 'Channel and ChannelMembership successfully created' };
      });

      return result;
    } catch (error) {
      // Si une exception est levée, une erreur s'est produite, renvoyez une erreur interne
      throw new InternalServerErrorException(`Error creating channel with users ${userId}`);
    }
  }

  async findAll(userId: string) {
    const findAllChannels = await this.prisma.channel.findMany({
      where: {
        ChannelMembership: {
          some: {
            user: {
              id: userId,
            },
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
        messages: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        },
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