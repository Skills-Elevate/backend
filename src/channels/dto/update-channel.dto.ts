import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './create-channel.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  @ApiPropertyOptional({ description: 'ID of the course associated with the channel' })
  courseId?: string;
}
