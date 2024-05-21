import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BlockedUserService } from './blocked-user.service';
import { BlockedUserDto } from './blockedUser.dto';
import { userRole } from 'src/enum/role.enum';
import { Roles } from 'src/guard/role';
import { RolesGuard } from 'src/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('block-user')
export class BlockedUserController {
  constructor(private readonly blockedUserService: BlockedUserService) {}

  @Post()
  // @UseGuards(AuthGuard(), RolesGuard)
  // @Roles(userRole.admin)
  blockUser(@Body() payload: BlockedUserDto) {
    return this.blockedUserService.block(payload);
  }
}
