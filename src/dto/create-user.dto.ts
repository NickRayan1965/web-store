import { ValidRoles } from '../interfaces/valid_roles.interface';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends BaseUserDto{
    dni: string;
    first_names: string;
    last_names: string;
    sex: string;
    birth_date: Date;
    phone_number: string;
    roles: ValidRoles[];
}