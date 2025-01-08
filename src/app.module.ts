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
import { MoviesModule } from './movies/movies.module';
import { ShowtimeModule } from './showtimes/showtimes.module';
import { BookingsModule } from './bookings/bookings.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from './chat/chat.module'; // Ensure the path matches your file structure

// Enable debugging for Mongoose
mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
  Logger.verbose(
    `${collectionName}.${methodName}(${JSON.stringify(methodArgs)})`,
    'Mongoose',
  );
});

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        PAYHERE_MERCHANT_ID: Joi.string().required(),
        PAYHERE_MERCHANT_SECRET: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI as string,
      {
        autoIndex: true,
        autoCreate: true,
      } as MongooseModuleOptions,
    ),
    // Continuation Local Storage (CLS) for request tracking
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
    MoviesModule,
    ShowtimeModule,
    BookingsModule,
    ChatModule, // Register the ChatModule here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
