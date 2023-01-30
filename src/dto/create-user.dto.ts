import { ValidRoles } from '../interfaces/valid_roles.interface';

export class CreateUserDto {
    email: string;
    password: string;
    dni: string;
    first_names: string;
    last_names: string;
    sex: string;
    birth_date: Date;
    phone_number: string;
    roles: ValidRoles[];
}