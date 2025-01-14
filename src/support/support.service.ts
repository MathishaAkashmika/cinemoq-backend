import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from '../customer support/question.schema';

@Injectable()
export class SupportService {
  constructor(@InjectModel(Question.name) private questionModel: Model<Question>) {}

  async saveQuestion(username: string, question: string): Promise<Question> {
    const newQuestion = new this.questionModel({ username, question });
    return newQuestion.save();
  }

  async saveAnswer(questionId: string, answer: string): Promise<Question> {
    return this.questionModel.findByIdAndUpdate(
      questionId,
      { answer },
      { new: true }, // Return the updated document
    );
  }

  async getAllQuestions(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }
}
