import { Request } from 'express';
import { AppDataSource } from '../database/db'
import { User } from '../entities/user.entity'
import { CreateUserDto } from '../dto/create-user.dto';

const userRepository = AppDataSource.getRepository(User);
export abstract class AuthService {
}
