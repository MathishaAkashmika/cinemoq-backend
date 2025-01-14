import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './question.schema';
import { QuestionsService } from './question.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }])],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
