import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query} from '@nestjs/common';
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
  async findAll(@Query('acceptedAccess') acceptedAccess: boolean, @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.channelsService.findAll(userId, acceptedAccess);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.channelsService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('joinchannel/:id')
  async acceptedAccess(@Param('id') id: string, @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.channelsService.joinChannel(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.channelsService.remove(id);
  }
}