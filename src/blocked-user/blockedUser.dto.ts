import { IsString, IsNotEmpty } from "class-validator";
import { CreateDateColumn } from "typeorm";

export class BlockedUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  adminId: string;

  @CreateDateColumn()
  createdDate: Date;
}
