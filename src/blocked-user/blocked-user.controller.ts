import { Body, Controller, Post } from '@nestjs/common';
import { BlockedUserService } from './blocked-user.service';
import { BlockedUserDto } from './blockedUser.dto';

@Controller('block-user')
export class BlockedUserController {
  constructor(private readonly blockedUserService: BlockedUserService) {}

  @Post()
  blockUser(@Body() payload: BlockedUserDto) {
    return this.blockedUserService.block(payload);
  }
}
