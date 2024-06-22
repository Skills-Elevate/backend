import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AdminMiddleware } from "./auth/middlewares/admin.middleware";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    disableErrorMessages: false,
  }));

  const config = new DocumentBuilder()
    .setTitle('BricoPartage')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const jwtService = app.get(JwtService);
  app.use('/admin', new AdminMiddleware(jwtService).use);

  await app.listen(3000);
}

bootstrap();
