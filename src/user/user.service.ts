import {
  BadRequestException,
  Body,
  ConflictException,
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
import { BlockedUserException } from 'src/exception/blockedUser.exception';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { error } from 'console';
import { ResetPasswordDto } from './dto/reset-password-dto';
import {otpGenerator} from 'otp-generator'
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
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
      userDetails: user.email,
    });
  }

  // async updateProfile(id: string, payload: CreateUserDto) {
  //   const user = await this.userRepo.findOne({ where: { id } });

  //   if (!user) {
  //     throw new HttpException('User not found', 404);
  //   }
  //   await this.userRepo.update(id, payload);
  //   console.log('Successfully updated!');
  // }

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

  async findEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email: email });

    if (!user) {
      throw new UnauthorizedException();
    } else {
      return user;
    }
  }

  async blockUser(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: id } });
      if (user && user.role === 'admin') {
        user.isBlock = false;
        throw new BadRequestException('You cannot block an admin');
      }
      user.isBlock = true;
      const isblocked = await this.userRepo.save(user);
      if (isblocked)
        throw new ConflictException(
          'Sorry, this user has already been blocked',
        );
      return 'User successfully blocked';
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong while blocking this user',
      );
    }
  }

  async unblockUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (user && user.isBlock === true) {
      user.isBlock = false;
      const userUnblocked = await this.userRepo.save(user);
      return 'User Successfully unblocked';
    }
    throw new BadRequestException('User was not blocked');
  }

  async forgotPassword(payload: ForgotPasswordDto, @Res() res) {
    const { email } = payload;
    const user = await this.userRepo.findOneBy({ email });

    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const otp = otpGenerator.generate(6,{specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false})
    //Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    user.otp = otp
    await this.userRepo.save(user)

    try {
      await this.mailService.sendMail({
        from: 'mercydanke10@gmail.com',
        to: `${user.email}`,
        subject: 'Forgot Password',
        html: `<p>Did you forget your password? Your One Time Passcode to recover your account is:${otp}</p>`,
        text: `This is your new password`,
      });
      res.send({
        message: `An otp has been sent to: ${user.email}`,
      });
    } catch (error) {
      return error;
    }
  }

  async checkOtp(otp: number, email: string){
    const user = await this.userRepo.findOne({ where: { email: email } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    if (otp !== user.otp){
      throw new error('Wrong otp!')
    }
    return "OTP accepted"
  }

  async resetPassword(email: string, payload: ResetPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: email } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const { password, confirmPassword } = payload;
    if (password === confirmPassword) {
      const hashpassword = await bcrypt.hash(password, 10);
      user.password = hashpassword;
      await this.userRepo.save(user);
      return user;
    }
  }

  async getAllusers() {
    return await this.userRepo.find();
  }
}
