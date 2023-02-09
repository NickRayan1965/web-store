import { Request, Response } from 'express';

import { User } from '../entities';
import { Encrypter } from '../common/helpers/encrypter.helper';
import jwtService from '../common/helpers/jwt';
import { CreateUserDto, LoginUserDto } from '../dto';
import { AppDataSource } from '../database/db';
import HttpReponse from '../common/helpers/http-response';
import { CreateOrLoginResponseDto } from '../dto/create-or-login-response.dto';
import { handleExceptions } from '../common/errors/handleExceptions';
import { HttpStatus } from '../common/helpers/http-status.helper';
import { ValidRoles } from '../interfaces/valid_roles.interface';
const userRepo = AppDataSource.getRepository(User);
const nameEntity = User.name;
const findAll = async (_: Request, res: Response) => {
};
const createAdminUser = async (req: Request, res: Response) => {
    const userData = res.locals.data as CreateUserDto;
    userData.password = Encrypter.encrypt(userData.password);
    let userCreated: User;
    try {
        userCreated =  await userRepo.save(userData);
    } catch (error: any) {
        return handleExceptions(error, nameEntity, res)
    }
    const createUserResponse: CreateOrLoginResponseDto = {
        jwt: jwtService.sign({userId: userCreated.id}),
        user: userCreated,
    };
    return res.status(HttpStatus.CREATED).json(createUserResponse);
};
const createCustomerUser = async (req: Request, res: Response) => {
    const userData = res.locals.data as CreateUserDto;
    if(userData.roles.includes(ValidRoles.admin)) return HttpReponse[HttpStatus.FORBIDDEN](res, `To create a user with 'admin' role use the following endpoint '/auth/register/admin'`)
    userData.password = Encrypter.encrypt(userData.password);
    let userCreated: User;
    try {
        userCreated =  await userRepo.save(userData);
    } catch (error: any) {
        return handleExceptions(error, nameEntity, res)
    }
    const createUserResponse: CreateOrLoginResponseDto = {
        jwt: jwtService.sign({userId: userCreated.id}),
        user: userCreated,
    };
    return res.status(HttpStatus.CREATED).json(createUserResponse);
};

const login = async (req: Request, res: Response) => {
    const {email, password} = res.locals.data as LoginUserDto;
    const user = await userRepo.findOne({where: { email: email}});
    if (!user) return HttpReponse[HttpStatus.UNAUTHORIZED](res, "Credentials aren't valid");

    if (!Encrypter.checkPassword(password, user.password)) return HttpReponse[HttpStatus.UNAUTHORIZED](res, "The credentials are not valid");
    
    if(!user.isActive) return HttpReponse[HttpStatus.UNAUTHORIZED](res, "Inactive User");
    
    const loginUserReponse: CreateOrLoginResponseDto = {
        user,
        jwt: jwtService.sign({userId: user.id}),
    };
    return res.json(loginUserReponse);
}

export { findAll, createAdminUser, createCustomerUser, login };