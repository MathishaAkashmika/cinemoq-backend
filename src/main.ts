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

  // Enable request logging
  useRequestLogging(app);

  // Enable API versioning (URI-based, e.g., /v1/)
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Add global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown properties from DTOs
      forbidNonWhitelisted: true, // Throw an error if unknown properties are present
      transform: true, // Automatically transform payloads to match DTO types
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return new BadRequestException(messages);
      },
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Inventory Management system')
    .setDescription(' Inventory Management system Backend API')
    .setVersion('1.0')
    .addTag('IMS')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document); // Swagger will be available at `/api`

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors();

  // Listen on port 8080
  await app.listen(8080);
}

bootstrap();
