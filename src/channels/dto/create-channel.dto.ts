import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ description: 'ID of the course associated with the channel' })
  @IsNotEmpty()
  courseId: string;
}
