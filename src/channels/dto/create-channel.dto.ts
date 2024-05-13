import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  courseId: string;
}