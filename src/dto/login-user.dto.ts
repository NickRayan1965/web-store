import { IsEmail,IsNotEmpty,IsString,MaxLength,MinLength } from "class-validator";

export class LoginUserDto{
    @IsEmail()
    @MaxLength(255)
    email: string;
    @IsString()
    @MaxLength(255)
    password: string;
}