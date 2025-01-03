import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { ulid } from 'ulid';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';
import { AuthModule } from './auth/auth.module';
import mongoose from 'mongoose';
import { UserModule } from './users/users.module';
import { S3Module } from './s3/s3.module';

mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
  Logger.verbose(
    `${collectionName}.${methodName}(${JSON.stringify(methodArgs)})`,
    'Mongoose',
  );
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI as string,
      {
        autoIndex: true,
        autoCreate: true,
      } as MongooseModuleOptions,
    ),
    /* cls module is used for managing Continuation Local Storage (CLS).
    This allows you to store and access data throughout entire lifecycle of a request.
    In this setup, a unique request ID (generated by ulid) is stored in the CLS,
    which can then be used for tracking and debugging purposes. */
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
    AuthModule,
    UserModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
