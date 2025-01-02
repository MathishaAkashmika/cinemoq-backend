import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    description: 'Base64 encoded image string',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^data:image\/(jpeg|jpg|png|gif);base64,/, {
    message: 'Invalid base64 image format',
  })
  base64Image: string;

  @ApiProperty({
    description: 'Folder name to store the image',
    required: false,
  })
  @IsOptional()
  @IsString()
  folder?: string;
}

export class DeleteImageDto {
  @ApiProperty({
    description: 'Full path of the image to delete',
    example: 'images/example-image.jpg',
  })
  @IsNotEmpty()
  @IsString()
  imagePath: string;
}

export class EditImageDto {
  @ApiProperty({
    description: 'Current path of the image to edit',
    example: 'images/old-image.jpg',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  currentPath: string;

  @ApiProperty({
    description: 'New base64 encoded image string',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^data:image\/(jpeg|jpg|png|gif);base64,/, {
    message: 'Invalid base64 image format',
  })
  newImage?: string;

  @ApiProperty({
    description: 'New folder path for the image',
    example: 'images/subfolder',
    required: false,
  })
  @IsOptional()
  @IsString()
  newFolder?: string;
}
