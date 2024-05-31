import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsNotEmpty } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class ResetPasswordDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}