import { IsOptional, IsString, Matches, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMovieDto {
  @ApiPropertyOptional({ description: 'Name of the movie' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Description of the movie' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Base64 encoded thumbnail image',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  })
  @IsOptional()
  @IsString()
  @Matches(/^data:image\/(jpeg|jpg|png|gif);base64,/, {
    message: 'Invalid base64 image format',
  })
  thumbnailImage?: string;

  @ApiPropertyOptional({
    description: 'Base64 encoded banner image',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  })
  @IsOptional()
  @IsString()
  @Matches(/^data:image\/(jpeg|jpg|png|gif);base64,/, {
    message: 'Invalid base64 image format',
  })
  bannerImage?: string;

  @ApiPropertyOptional({
    description:
      'Whether to show thumbnail image (true) or banner image (false)',
  })
  @IsOptional()
  @IsBoolean()
  is_thumbnail?: boolean;
}
