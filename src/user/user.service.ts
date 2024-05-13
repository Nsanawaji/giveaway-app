import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/Entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import path from 'path';
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
    const profilePicturePath = await this.uploadProfilePicture(profilePicture);

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

  async uploadProfilePicture(
    profilePicture: Express.Multer.File,
  ): Promise<string> {
    const filename = `${Date.now()}-${profilePicture.originalname}`;
    const filePath = path.join(
      __dirname,
      '..',
      'uploads',
      'profilePictures',
      filename,
    );

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, profilePicture.buffer, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(filePath);
        }
      });
    });
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
