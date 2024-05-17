import {
  BadRequestException,
  Body,
  HttpException,
  Injectable,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/Entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: CreateUserDto) {
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

    try {
      const user = await this.userRepo.save({
        email,
        password: hashpassword,
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

  async login(payload: LoginDto, @Res() res: Response) {
    const { email, password } = payload;
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new HttpException('Email not found', 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new HttpException('Invalid email or password', 404);

    const token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('userauthenticated', token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });
    delete user.password;
    return res.send({
      message: 'User logged in successfully',
      userToken: token,
      userDetails: user,
    });
  }

  async updateProfile(id: string, payload: CreateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', 404);
    }
    await this.userRepo.update(id, payload);
    console.log('Successfully updated!');
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
