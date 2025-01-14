import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateQuestionDto } from '../customer support/dto/create-question.dto';

@ApiTags('Customer Support')
@ApiBearerAuth()
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('questions')
  async getAllQuestions() {
    return this.supportService.getAllQuestions();
  }

  @Post('questions')
  @ApiBody({ type: CreateQuestionDto })
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    console.log('Received Body:', createQuestionDto); // Debugging
    return this.supportService.saveQuestion(
      createQuestionDto.username,
      createQuestionDto.question,
    );
  }
}
