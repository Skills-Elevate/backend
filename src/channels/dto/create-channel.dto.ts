import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  courseId: string;
}