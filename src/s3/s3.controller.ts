import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { S3Service } from './s3.service';
import {
  GeneratePresignedUrlDto,
  GeneratePresignedUrlResponseDto,
} from './dto/create-s3.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('s3')
@Controller({ path: 's3', version: '1' })
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @ApiOkResponse({
    description: 'The presigned url has been successfully generated.',
    type: GeneratePresignedUrlResponseDto,
  })
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  @Post('generate-presigned-url')
  create(
    @Body() generatePresignedUrlDto: GeneratePresignedUrlDto,
  ): Promise<GeneratePresignedUrlResponseDto> {
    return this.s3Service.generatePresignedUrl(generatePresignedUrlDto);
  }
}
