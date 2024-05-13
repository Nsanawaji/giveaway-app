import {
  BadRequestException,
  FileTypeValidator,
  HttpException,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/Entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/files/utils';
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async register(payload: CreateUserDto, profilePicture: Express.Multer.File) {
    payload.email = payload.email.toLowerCase();
    const { email, password, ...rest } = payload;
    const isUser = await this.userRepo.findOneBy({ email });
    if (isUser) {
      throw new HttpException(
        `Sorry, user with this email: ${email} currently exists`,
        400,
      );
    }

    // Encrypt password
    const hashpassword = await bcrypt.hash(password, 10);

    //Upload profile picture
    const profilePicturePath = this.uploadFile(profilePicture);

    try {
      const user = await this.userRepo.save({
        email,
        password: hashpassword,
        profilePicture: profilePicturePath,
        ...rest,
      });
      delete user.password;
      console.log(`Successfuly registered!`);
      return user;
    } catch (error) {
      if (error.code === '22P02') {
        throw new BadRequestException('admin role should be lowercase');
      }
      return error;
    }
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/freddypix',
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
    return file;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
