import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  

  @ApiProperty({
      description: 'Name of the review Author',
      example: 'Savindu',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'The content of the review',
        example: 'Fantastic Movie. Thank You',
      })
      @IsNotEmpty()
      @IsString()
      content: string;

 

  @ApiProperty({
    description: 'The rating of the review',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
