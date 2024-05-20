import { Module } from '@nestjs/common';
import { BlockedUserService } from './blocked-user.service';
import { BlockedUserController } from './blocked-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedUser } from './blockedUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlockedUser])
  ],
  controllers: [BlockedUserController],
  providers: [BlockedUserService],
})
export class BlockedUserModule {}
