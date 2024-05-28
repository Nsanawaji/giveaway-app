import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { BlockGuard } from 'src/guard/block.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body() payload: CreateUserDto,
    @Body() profilePicture: Express.Multer.File,
  ) {
    return this.userService.register(payload);
  }

  @Post('login')
  async login(@Body() payload: LoginDto, @Res() res: Response) {
    const token = await this.userService.login(payload, res);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: CreateUserDto) {
    return await this.userService.updateProfile(id, payload);
  }
  @UseGuards(AuthGuard(), BlockGuard)
  @Post('block/:id')
  async blockUser(@Param('id') id: string) {
    return await this.userService.blockUser(id);
  }

  @Post('unblock/:id')
  async unblockUser(@Param('id') id: string) {
    return await this.userService.unblockUser(id);
  }

  @UseGuards(AuthGuard(), BlockGuard)
  @Get()
  async findAll() {
    return this.userService.getAllusers();
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }

  @Get('forgotpassword')
  async sendMailer(@Body()payload: ForgotPasswordDto, @Res() response: any) {
    const mail = await this.userService.retrievePassword(payload);

    }
}
