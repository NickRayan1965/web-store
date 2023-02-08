import { IsEmail,IsNotEmpty,IsString,MinLength } from "class-validator";
import { BaseUserDto } from "./base-user.dto";

export class LoginUserDto{
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}