import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule.forRoot(), PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
