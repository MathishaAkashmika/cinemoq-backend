import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';


export class CreateCategoryDto {
  @ApiProperty({
    description: 'Movies Category Name',
    example: 'Most Popular',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

}
