import { User } from '../entities/user.entity';

export class CreateOrLoginResponseDto {
    user: User;
    jwt: string;
}
