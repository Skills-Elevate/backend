import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ description: 'Name of the course' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the course' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Price of the course' })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Image URL of the course' })
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ description: 'ID of the author of the course' })
  @IsNotEmpty()
  authorId: string;
}
