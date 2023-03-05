import { User } from '../../src/entities/user.entity';
import { v4 as uuid} from 'uuid';
import { faker } from '@faker-js/faker';
import { getRandomInt } from '../../src/common/helpers/get-random-int.helper';
import { Encrypter } from '../../src/common/helpers/encrypter.helper';
import { ValidRoles } from '../../src/interfaces/valid_roles.interface';
import { CreateUserDto } from '../../src/dto/create-user.dto';
export class UserAdminStubOptions {
    isActiveRandom: boolean;
    encrypt: boolean;
    toCreate: boolean;
}
export const stubAdminUser = ({encrypt = false, isActiveRandom = false, toCreate = false}: Partial<UserAdminStubOptions> = {encrypt: false, isActiveRandom: false, toCreate: false}, userData: Partial<Omit<User, 'id'>> = {}): User | CreateUserDto => {
    const id = uuid();
    const sex = getRandomInt(0,2) == 1 ? 'femail': 'male';
    const pwd = 'contraseñaAdmin1234';
    let user: CreateUserDto | User= { 
        email: `${id}@gmail.com`,
        birth_date: new Date(2003, 4, 4),
        roles: [ValidRoles.admin, ValidRoles.customer],
        first_names: `first names nro ${id}`,
        last_names: `last names nro ${id}`,
        dni: faker.random.numeric(8, { allowLeadingZeros: true }),
        password: encrypt ? Encrypter.encrypt(pwd) : pwd,
        phone_number: '+51 999 999 999',
        sex: sex == 'male' ? 'M' : 'F',
    };
    if (!toCreate) {
        user = {
            ...user,
            id,
            email_confirmed: true, createdAt: new Date(),
            updatedAt: new Date(),
            isActive: isActiveRandom ? getRandomInt(0, 2) == 1 : true,
        };
    }
    const userKeys = Object.keys(user);
    const userDataKeys = Object.keys(userData);
    for(const key of userDataKeys){
        if (userKeys.includes(key)){ 
            user[key] = userData[key];
        };
    }
    return user;
    
}