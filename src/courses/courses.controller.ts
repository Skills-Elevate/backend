import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { CoursesService } from './courses.service';
import { CreateCourseDto } from "./dto/create-course.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiBody, ApiResponse } from "@nestjs/swagger";

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Return all courses' })
  findAll(@Query('name') name?: string, @Query('category') category?: string) {
    return this.coursesService.findAll({ name, category });
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  getCount() {
    return this.coursesService.getCount();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ status: 201, description: 'The course has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.coursesService.create(createCourseDto, userId);
  }

  @Get('my_courses')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Return all courses created by the coach' })
  findAllMyCourses(@Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.coursesService.findAllCoursesByCoach(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Return a specific course' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id') id: string, @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.coursesService.findOne(id, userId);
  }

  @Get('test')
  @ApiResponse({ status: 200, description: 'Test route works!' })
  testRoute() {
    console.log('Test route accessed');
    return { message: 'Test route works!' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ status: 200, description: 'The course has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateCourseDto: CreateCourseDto, @Req() req) {
    const token = req.user;
    const userId = token.user.userId;
    return this.coursesService.update(id, updateCourseDto, userId);
  }
}
