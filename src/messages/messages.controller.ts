import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiBody, ApiResponse } from "@nestjs/swagger";

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({ status: 201, description: 'The message has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createMessageDto: CreateMessageDto, @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.messagesService.create(createMessageDto, userId);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieve all messages' })
  findAll() {
    return "eheheh all massages";
  }
}
