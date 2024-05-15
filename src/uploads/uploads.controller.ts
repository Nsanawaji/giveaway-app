import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Param,
  Req,
  Res,
  Delete,
} from '@nestjs/common';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './utils';
import * as fs from 'fs';

@Controller('upload')
export class UploadsController {
  constructor() {}

  @Post('profilepic')
  @UseInterceptors(
    FileInterceptor('imgfile', {
      storage: diskStorage({
        destination: './src/profilepics',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
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

  @Post('items')
  @UseInterceptors(
    FilesInterceptor('image', 3, {
      storage: diskStorage({
        destination: './src/itempix',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileResponse = {
        originalname: file.originalname,
        filename: file.filename,
      };

      response.push(fileResponse);
    });
    return response;
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './src/files' });
  }

  @Delete(':imgpath')
  deleteImg(
    @Param('imgpath') image,
    @Req() requestAnimationFrame,
    @Res() res,
  ): Promise<string> {
    fs.rm('./src/files/' + image, (err) => {
      if (err) {
        throw err;
      }
    });
    return res.end(`Successfully deleted ${image}`);
  }
}
