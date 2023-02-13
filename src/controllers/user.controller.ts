import { Request, Response } from 'express';

import { User } from '../entities';

import { AppDataSource } from '../database/db';
import EnvConfiguration from '../config/app.config';
import { BasicQueryParams } from '../dto/basic-query-params.dto';
import HttpReponse from '../common/helpers/http-response';
import { HttpStatus } from '../common/helpers/http-status.helper';
import ValidateResourseOwner from '../common/validations/validate-resourse-owner.validation';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ValidRoles } from '../interfaces/valid_roles.interface';
import { handleExceptions } from '../common/errors/handleExceptions';
const {LIMIT,OFFSET} = EnvConfiguration;
const userRepo = AppDataSource.getRepository(User);
const nameEntity = User.name;
export const findAll = async (_: Request, res: Response) => {
    const {limit = +LIMIT, offset = +OFFSET} = res.locals.query as BasicQueryParams;
    const users = await userRepo.find({where: {isActive: true},skip: offset, take: limit});
    return res.json(users);
};
export const findById = async (req: Request, res: Response) => {
    const requestingUser: User = res.locals.user; 
    const id: string = res.locals.params.id;
    const user = await userRepo.findOne({where: {id}});
    if (!user) return HttpReponse[HttpStatus.NOT_FOUND](res, `There is no ${nameEntity} with id: '${id}'`);
    const hasPermission = ValidateResourseOwner({
        requestingUser,
        resource: user,
    });
    if (!hasPermission) return HttpReponse[HttpStatus.FORBIDDEN](res);
    return res.json(user);
}
export const updateUserById = async (req: Request, res: Response) => {
    const requestingUser: User = res.locals.user;
    const id: string = res.locals.params.id;
    let userInDB = await userRepo.findOne({where: {id}});
    const updates: Partial<UpdateUserDto> = res.locals.data;
    if (!userInDB) return HttpReponse[HttpStatus.NOT_FOUND](res, `There is no ${nameEntity} with id: '${id}'`);
    const hasPermission = ValidateResourseOwner({requestingUser, resource: userInDB});
    if (!hasPermission) return HttpReponse[HttpStatus.FORBIDDEN](res);
    if (updates.roles && !requestingUser.roles.includes(ValidRoles.admin)) return HttpReponse[HttpStatus.FORBIDDEN](res, "Only administrators can update a user's roles");

    userInDB = {...userInDB, ...updates};
    try {
        userInDB = await userRepo.save(userInDB);
    } catch (error: any) {
        return handleExceptions(error, nameEntity, res);
    }
    return res.json(userInDB);
};
export const deleteUserById = async (req: Request, res: Response) => {
    const requestingUser: User = res.locals.user;
    const id: string = res.locals.params.id;
    const userInDB = await userRepo.findOne({where: {id}});
    if (!userInDB) return HttpReponse[HttpStatus.NOT_FOUND](res, `There is no ${nameEntity} with id: '${id}'`);
    const hasPermission = ValidateResourseOwner({requestingUser, resource: userInDB});
    if (!hasPermission) return HttpReponse[HttpStatus.FORBIDDEN](res);
    userInDB.isActive = false;
    await userRepo.save(userInDB);
    return res.status(HttpStatus.NO_CONTENT).json();
};