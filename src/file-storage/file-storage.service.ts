import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly uploadDir = 'uploads';

  constructor() {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveBase64Image(
    base64String: string,
    folder: string = 'images',
  ): Promise<string> {
    try {
      // Create folder if it doesn't exist
      const folderPath = path.join(this.uploadDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Extract image type and base64 data
      const matches = base64String.match(
        /^data:image\/([A-Za-z-+\/]+);base64,(.+)$/,
      );

      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
      }

      const imageType = matches[1];
      const imageData = matches[2];

      // Generate unique filename
      const filename = `${uuid()}.${imageType}`;
      const filepath = path.join(folderPath, filename);

      // Save the file
      fs.writeFileSync(filepath, imageData, 'base64');

      this.logger.log(`Image saved successfully: ${filepath}`);

      // Return the relative path to store in database
      return path.join(folder, filename);
    } catch (error) {
      this.logger.error(`Error saving image: ${error.message}`);
      throw error;
    }
  }

  async editImage(
    currentPath: string,
    newImage?: string,
    newFolder?: string,
  ): Promise<string> {
    try {
      const fullCurrentPath = path.join(this.uploadDir, currentPath);

      // Check if current file exists
      if (!fs.existsSync(fullCurrentPath)) {
        throw new Error('Current image not found');
      }

      let newFilePath = currentPath;

      // If new image content is provided
      if (newImage) {
        // Delete the old file
        await this.deleteFile(currentPath);

        // Save the new image
        newFilePath = await this.saveBase64Image(
          newImage,
          newFolder || path.dirname(currentPath),
        );
      }
      // If only new folder is provided
      else if (newFolder) {
        const fileName = path.basename(currentPath);
        const newFolderPath = path.join(this.uploadDir, newFolder);

        // Create new folder if it doesn't exist
        if (!fs.existsSync(newFolderPath)) {
          fs.mkdirSync(newFolderPath, { recursive: true });
        }

        // Move file to new location
        const newFullPath = path.join(newFolderPath, fileName);
        fs.renameSync(fullCurrentPath, newFullPath);

        newFilePath = path.join(newFolder, fileName);
      }

      return newFilePath;
    } catch (error) {
      this.logger.error(`Error editing image: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(filepath: string): Promise<void> {
    try {
      const fullPath = path.join(this.uploadDir, filepath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        this.logger.log(`File deleted successfully: ${filepath}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw error;
    }
  }

  async deleteFolder(folder: string): Promise<void> {
    try {
      const folderPath = path.join(this.uploadDir, folder);
      if (fs.existsSync(folderPath)) {
        fs.rmdirSync(folderPath, { recursive: true });
        this.logger.log(`Folder deleted successfully: ${folder}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting folder: ${error.message}`);
      throw error;
    }
  }
}
