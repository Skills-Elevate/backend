import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { CoursesService } from './courses.service';
import { CreateCourseDto } from "./dto/create-course.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll(@Query('name') name?: string, @Query('category') category?: string) {
    return this.coursesService.findAll({ name, category });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }
}
