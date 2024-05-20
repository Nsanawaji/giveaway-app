import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BlockedUser } from './blockedUser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockedUserDto } from './blockedUser.dto';

@Injectable()
export class BlockedUserService {
  constructor(
    @InjectRepository(BlockedUser)
    private blockedUserRepo: Repository<BlockedUser>,
  ) {}

  async block(payload) {
    const { userId, adminId } = payload;
    const blockedAlready = await this.blockedUserRepo.findOne({
      where: { userId: userId },
    });
    if (blockedAlready) {
      throw new HttpException(
        `The user with ID: ${userId} is already blocked by admin.`,
        404,
      );
    }
    const blockUser = await this.blockedUserRepo.create(payload);
    return this.blockedUserRepo.save(blockUser);
  }
}
