import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

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


  
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: CreateUserDto) {
    return this.userService.updateProfile(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
