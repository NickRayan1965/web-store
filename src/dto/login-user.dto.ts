import { IsEmail,IsNotEmpty,IsString,MaxLength,MinLength } from "class-validator";
import { BaseUserDto } from "./base-user.dto";

export class LoginUserDto{
    @IsEmail()
    @MaxLength(255)
    email: string;
    @IsString()
    @MaxLength(255)
    password: string;
}