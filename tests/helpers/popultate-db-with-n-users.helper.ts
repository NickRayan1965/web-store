import { DataSource, Repository } from 'typeorm';
import { User } from '../../src/entities';
import { stubAdminUser } from '../stub/user.stub'

export const PopupalteDbWith_N_Users = async (n_users: number, userRepo: Repository<User>) => {
    const users: User[] = []
    for(let i = 0; i < n_users; i++) {
        const user = stubAdminUser({encrypt: true, isActiveRandom: true});
        users.push(user as User);
    }
    await userRepo.insert(users);
}