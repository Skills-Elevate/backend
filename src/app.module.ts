import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, AuthModule, PostsModule, CoursesModule],
})
export class AppModule {}
