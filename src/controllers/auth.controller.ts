import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
const findAll = async (_: Request, res: Response) => {
};
const createUser = async (req: Request, res: Response) => {
};
export default {findAll, createUser};