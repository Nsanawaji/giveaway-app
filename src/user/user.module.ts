import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BlockedUser } from 'src/blocked-user/blockedUser.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, BlockedUser])
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
