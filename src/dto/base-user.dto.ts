import { IsEmail,IsNotEmpty,MinLength } from "class-validator";

export class BaseUserDto{

        @IsEmail()
        @IsNotEmpty()
        email: string;
    
        @MinLength(6)
        @IsNotEmpty()
        password: string;
}