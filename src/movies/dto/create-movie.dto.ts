import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({
    description: 'The name of the movie',
    example: 'The Dark Knight',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Movie description',
    example:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'URL of the movie thumbnail image',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnailImage: string;

  @ApiPropertyOptional({
    description: 'URL of the hero/banner image',
    example: 'https://example.com/hero.jpg',
  })
  @IsOptional()
  @IsString()
  heroImage: string;

  @ApiPropertyOptional({
    description: 'Whether the movie should be featured as hero',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isHero: boolean;

  @ApiProperty({
    description: 'Movie price',
    minimum: 0,
    example: 9.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Movie category',
    example: 'dasdafafagasfa',
  })
  @IsOptional()
  @IsMongoId()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Movie director',
    example: 'Christopher Nolan',
  })
  @IsOptional()
  @IsString()
  director: string;

  @ApiPropertyOptional({
    description: 'Movie release date',
    example: '2008-07-18T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  releaseDate: Date;

  @ApiPropertyOptional({
    description: 'Movie rating',
    minimum: 0,
    maximum: 10,
    default: 0,
    example: 9.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiPropertyOptional({
    description: 'Movie cast members',
    type: [String],
    example: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cast: string[];

  @ApiPropertyOptional({
    description: 'Movie duration in minutes',
    minimum: 0,
    example: 152,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  durationMinutes: number;
}
