
import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './utils';

@Controller()
export class UploadsController {
  static uploadFile(profilePicture: Express.Multer.File) {
    throw new Error('Method not implemented.');
  }
  constructor() {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/freddypix',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
  }
}
