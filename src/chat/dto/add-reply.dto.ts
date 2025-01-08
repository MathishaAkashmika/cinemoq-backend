import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsDate,
    IsNumber,
    IsString,
    Min,
    Max,
    IsBoolean,
    IsArray,
    IsOptional,
  } from 'class-validator';

  export class AddReplyDto {
    @ApiProperty({ example: 'This is a reply to your message!' })
    @IsNotEmpty()
    @IsString()
    content: string;
  
    @ApiProperty({ example: '64772530adc515a722aae6ee' })
    @IsNotEmpty()
    @IsString()
    userId: string;
  
    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    @IsString()
    firstName: string;
  
    @ApiProperty({ example: 'Doe' })
    @IsNotEmpty()
    @IsString()
    lastName: string;
  
    @ApiProperty({
      example: 'https://s3.amazonaws.com/bucket-name/profile-pictures/john.jpg',
    })
    @IsNotEmpty()
    @IsString()
    profilePicture: string;
  }
  
