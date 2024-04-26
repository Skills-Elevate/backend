import { IsNotEmpty } from "class-validator";
export class CreateCourseDto {
  @IsNotEmpty()
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  author: string;
}