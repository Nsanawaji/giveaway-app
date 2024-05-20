import {
  BadRequestException,
  Body,
  HttpException,
  Injectable,
  Res,
  UnauthorizedException,
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
import { BlockedUser } from 'src/blocked-user/blockedUser.entity';
import { BlockedUserException } from 'src/exception/blockedUser.exception';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(BlockedUser)
    private blockedUserRepo: Repository<BlockedUser>,
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

  async login(payload: LoginDto, @Res() res: Response): Promise<any> {
    const { email, password } = payload;

    // Check if user is blocked by an admin
    const isUserBlocked = await this.blockedUserRepo.findOne({
      where: { userEmail: email },
    });
    if (isUserBlocked) throw new BlockedUserException();

    // Check if user is registered in the database
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new HttpException('Email not found', 404);

    // Check if inputed password matches encrypted password
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


  async user(headers: any): Promise<any> {
    const authorizationHeader = headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '');
      const secret = process.env.JWT_SECRET;
      try {
        const decoded = this.jwtService.verify(token);
        let id = decoded['id'];
        let user = await this.userRepo.findOneBy({ id });

        return {
          id: id,
          name: user.username,
          email: user.email,
          role: user.role,
        };
      } catch (error) {
        throw new UnauthorizedException('Invalid Token');
      }
    } else {
      throw new UnauthorizedException('Invalid or missing Bearer Token');
    }
  }
}
