import { IsDateString, IsEmail, IsEnum, IsPhoneNumber, IsString, Length, MaxLength } from 'class-validator';
import { ValidRoles } from '../interfaces/valid_roles.interface';
import { Sex } from '../interfaces/sex.enum';

export class CreateUserDto {
    @IsEmail()
    @MaxLength(255)
    email: string;
    @IsString()
    @MaxLength(255)
    password: string;
    @IsString()
    @Length(8,8)
    dni: string;
    @IsString()
    first_names: string;
    @IsString()
    last_names: string;
    @IsEnum(Sex)
    sex: string;
    @IsDateString({strict: true, strictSeparator: true})
    birth_date: Date;
    @IsPhoneNumber('PE')
    phone_number: string;
    @IsEnum(ValidRoles, {each: true})
    roles: ValidRoles[];
}