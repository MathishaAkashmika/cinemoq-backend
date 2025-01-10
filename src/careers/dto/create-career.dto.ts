import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateCareerDto {
  @ApiProperty({
    description: 'The name of the career position',
    example: 'Senior Software Engineer',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the career position',
    example: 'We are looking for an experienced software engineer to join our team...',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'URL of the career image',
    example: 'https://example.com/career-image.jpg',
  })
  @IsOptional()
  @IsString()
  image: string;
}