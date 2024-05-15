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

@Controller()
export class UploadsController {
  constructor() {}

  @Post('uploadprofilepic')
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
    return file.filename;
  }

  @Post('uploaditems')
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
    return res.sendFile(image, { root: './src/itempix/' });
  }

  @Delete(':imgpath')
  deleteImg(
    @Param('imgpath') image,
    @Req() requestAnimationFrame,
    @Res() res,
  ): Promise<string> {
    fs.rm('./src/itempix/' + image, (err) => {
      if (err) {
        throw err;
      }
    });
    return res.end(`Successfully deleted ${image}`);
  }
}
