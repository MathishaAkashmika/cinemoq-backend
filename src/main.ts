import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useRequestLogging } from './request-logging';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
    bodyParser: true,
  });
  useRequestLogging(app);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return new BadRequestException(messages);
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(' Inventory Management system')
    .setDescription(' Inventory Management system Backend API')
    .setVersion('1.0')
    .addTag('IMS')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  app.enableCors();

  await app.listen(9000);
}
bootstrap();
