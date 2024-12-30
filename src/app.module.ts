import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ulid } from 'ulid';
import { ClsModule } from 'nestjs-cls';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
        MYSQL_USERNAME: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_SYNCHRONIZE: Joi.boolean().required(),
        JWT_SECRET: Joi.string().required(),
        BREVO_SMTP: Joi.string().required(),
        BREVO_USER: Joi.string().required(),
        BREVO_PASS: Joi.string().required(),
        BREVO_SMTP_PORT: Joi.string().required(),
        EMAIL_FROM_ADDRESS: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
      }),
    }),
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls, req, res) => {
          const requestId = ulid();
          cls.set('x-request-id', requestId);
          res.setHeader('X-Request-ID', requestId);
        },
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
