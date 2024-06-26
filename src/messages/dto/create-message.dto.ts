import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: 'ID of the channel associated with the message' })
  @IsNotEmpty()
  channelId: string;

  @ApiProperty({ description: 'Content of the message' })
  @IsNotEmpty()
  content: string;
}
