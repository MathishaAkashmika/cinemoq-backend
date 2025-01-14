import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportGateway } from './support.gateway';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { Question, QuestionSchema } from '../customer support/question.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_PUBLIC_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SupportGateway, SupportService],
  controllers: [SupportController],
})
export class SupportModule {}
