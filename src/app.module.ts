import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { UploadsModule } from './uploads/uploads.module';
import { BlockedUserModule } from './blocked-user/blocked-user.module';

@Module({
  imports: [UserModule, DatabaseModule, UploadsModule, BlockedUserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
