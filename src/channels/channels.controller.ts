import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, InternalServerErrorException } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() CreateChannelsDto: CreateChannelDto, @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.channelsService.create(CreateChannelsDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.channelsService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.channelsService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.channelsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('joinchannel/:channelId')
  async joinChannel(@Param('channelId') channelId: string, @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    try {
      await this.channelsService.joinChannel(channelId, userId);
      return { message: 'Channel and associated user successfully accepted' };
    } catch (error) {
      throw new InternalServerErrorException(`Error accepting access to channel with id ${channelId}`);
    }
  }
}