import { Controller, Get, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll(@Query('name') name?: string, @Query('category') category?: string) {
    return this.coursesService.findAll({ name, category });
  }
}
