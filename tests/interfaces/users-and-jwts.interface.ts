import { LoginUserDto } from '../../src/dto/login-user.dto';
import { User } from '../../src/entities/user.entity';

export interface UsersAndJwts {
    admin: {
        credential: LoginUserDto,
        data: User,
        jwt: string;
    };
    customer: {
        credential: LoginUserDto,
        data: User,
        jwt: string;
    };
    noRoles: {
        credential: LoginUserDto,
        data: User,
        jwt: string;
    };
}
