import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
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
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.coursesService.create(createCourseDto, userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string,  @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.coursesService.findOne(id, userId);
  }
}
