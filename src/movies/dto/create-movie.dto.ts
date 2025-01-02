import {
  IsNotEmpty,
  IsString,
  Matches,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ description: 'Name of the movie' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the movie' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Base64 encoded thumbnail image',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^data:image\/(jpeg|jpg|png|gif);base64,/, {
    message: 'Invalid base64 image format',
  })
  thumbnailImage: string;

  @ApiProperty({
    description: 'Base64 encoded banner image',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^data:image\/(jpeg|jpg|png|gif);base64,/, {
    message: 'Invalid base64 image format',
  })
  bannerImage: string;

  @ApiProperty({
    description:
      'Whether to show thumbnail image (true) or banner image (false)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_thumbnail?: boolean = true;
}
