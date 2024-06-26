import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({ description: 'Title of the post' })
  title?: string;

  @ApiPropertyOptional({ description: 'Content of the post' })
  content?: string;
}
