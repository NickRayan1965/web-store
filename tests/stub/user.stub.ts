import { User } from '../../src/entities/user.entity';
import { v4 as uuid} from 'uuid';
import { faker } from '@faker-js/faker';
import { getRandomInt } from '../../src/common/helpers/get-random-int.helper';
import { Encrypter } from '../../src/common/helpers/encrypter.helper';
import { ValidRoles } from '../../src/interfaces/valid_roles.interface';
export class UserAdminStubOptions {
    isActiveRandom: boolean;
    encrypt: boolean;
    undefined_id: boolean;
}
export const stubAdminUser = ({encrypt = false, isActiveRandom = false, undefined_id = false}: Partial<UserAdminStubOptions> = {encrypt: false, isActiveRandom: false, undefined_id: false}, userData: Partial<Omit<User, 'id'>> = {}): User => {
    const id = uuid();
    const sex = getRandomInt(0,2) == 1 ? 'femail': 'male';
    const pwd = 'contraseñaAdmin1234';
    return {
        id: undefined_id ? undefined as any: id,
        email: `${id}@gmail.com`,
        birth_date: new Date(2000, 1, 1),
        email_confirmed: false,
        roles: [ValidRoles.admin, ValidRoles.customer],
        first_names: `first names nro ${id}`,
        last_names: `last names nro ${id}`,
        dni: faker.random.numeric(8, { allowLeadingZeros: true }),
        password: encrypt ? Encrypter.encrypt(pwd) : pwd,
        createdAt: new Date(),
        updatedAt: new Date(),
        phone_number: '+51 999 999 999',
        sex: sex == 'male' ? 'M' : 'F',
        isActive: isActiveRandom ? getRandomInt(0, 2) == 1 : true,
        ...userData,
    };
}