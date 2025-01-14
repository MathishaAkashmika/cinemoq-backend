import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ description: 'The username', example: 'user@example.com' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'The question', example: 'How can I reset my password?' })
  @IsString()
  @IsNotEmpty()
  question: string;
}
