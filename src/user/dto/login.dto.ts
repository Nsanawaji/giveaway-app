import { IsNotEmpty, IsString } from "class-validator"

export class LoginDto {

    @IsString()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}