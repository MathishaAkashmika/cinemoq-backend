import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  UploadImageDto,
  DeleteImageDto,
  EditImageDto,
} from './dto/file-storage.dto';

@ApiTags('files')
@Controller('files')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a base64 encoded image' })
  async uploadImage(@Body() uploadImageDto: UploadImageDto) {
    const filepath = await this.fileStorageService.saveBase64Image(
      uploadImageDto.base64Image,
      uploadImageDto.folder,
    );
    return { filepath };
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete an image using its path' })
  async deleteImage(@Body() deleteImageDto: DeleteImageDto) {
    await this.fileStorageService.deleteFile(deleteImageDto.imagePath);
    return { message: 'File deleted successfully' };
  }

  @Patch('edit')
  @ApiOperation({ summary: 'Edit an existing image' })
  async editImage(@Body() editImageDto: EditImageDto) {
    const result = await this.fileStorageService.editImage(
      editImageDto.currentPath,
      editImageDto.newImage,
      editImageDto.newFolder,
    );
    return { filepath: result };
  }

  @Delete(':folder/:filename')
  @ApiOperation({ summary: 'Delete a file using folder and filename' })
  async deleteFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
  ) {
    const filepath = `${folder}/${filename}`;
    await this.fileStorageService.deleteFile(filepath);
    return { message: 'File deleted successfully' };
  }

  @Delete('folder/:folder')
  @ApiOperation({ summary: 'Delete a folder and its contents' })
  async deleteFolder(@Param('folder') folder: string) {
    await this.fileStorageService.deleteFolder(folder);
    return { message: 'Folder deleted successfully' };
  }
}
