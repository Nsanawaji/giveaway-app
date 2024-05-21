import { Module } from '@nestjs/common';
import { BlockedUserService } from './blocked-user.service';
import { BlockedUserController } from './blocked-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedUser } from './blockedUser.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/Entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/Strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BlockedUser]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          algorithm: configService.getOrThrow('JWT_ALGORITHM'),
          expiresIn: configService.getOrThrow<string>('JWT_EXPIRESIN'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
  ],
  controllers: [BlockedUserController],
  providers: [BlockedUserService, UserService, JwtService],
  exports: [PassportModule, UserService],
})
export class BlockedUserModule {}
