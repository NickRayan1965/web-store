import { IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, Length, MaxLength } from 'class-validator';
import { ValidRoles } from '../interfaces/valid_roles.interface';
import {Sex} from '../interfaces/sex.enum';
export class UpdateUserDto{
    @IsEmail()
    @MaxLength(255)
    @IsOptional()
    email: string;
    @IsString()
    @MaxLength(255)
    @IsOptional()
    password: string;
    @IsString()
    @Length(8,8)
    @IsOptional()
    dni: string;
    @IsString()
    @IsOptional()
    first_names: string;
    @IsString()
    @IsOptional()
    last_names: string;
    @IsEnum(Sex)
    @IsOptional()
    sex: string;

    @IsOptional()
    @IsDateString({strict: true, strictSeparator: true})
    birth_date: string | Date;
    
    @IsPhoneNumber('PE')
    @IsOptional()
    phone_number: string;
    @IsEnum(ValidRoles, {each: true})
    @IsOptional()
    roles: ValidRoles[];
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}