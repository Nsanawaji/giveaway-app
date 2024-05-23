import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/Strategy/jwt.strategy';
import { BlockGuard } from 'src/guard/block.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  controllers: [UserController],
  providers: [UserService, JwtStrategy, BlockGuard],
  exports: [JwtStrategy, PassportModule, UserService],
})
export class UserModule {}
