import { Request, Response } from 'express';

import { User } from '../entities';

import { AppDataSource } from '../database/db';
import EnvConfiguration from '../config/app.config';
import { BasicQueryParams } from '../dto/basic-query-params.dto';
import HttpReponse from '../common/helpers/http-response';
import { HttpStatus } from '../common/helpers/http-status.helper';
import ValidateResourseOwner from '../common/validations/validate-resourse-owner.validation';
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
