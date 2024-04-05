import { IsNotEmpty } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  channelId: string;
  content: string;
}