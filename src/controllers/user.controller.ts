import { Request, Response } from 'express';

import { User } from '../entities';

import { AppDataSource } from '../database/db';
import EnvConfiguration from '../config/app.config';
import { BasicQueryParams } from '../dto/basic-query-params.dto';
const {LIMIT,OFFSET} = EnvConfiguration;
const userRepo = AppDataSource.getRepository(User);
const nameEntity = User.name;
const findAll = async (_: Request, res: Response) => {
    const {limit = +LIMIT, offset = +OFFSET} = res.locals.query as BasicQueryParams;
    const users = await userRepo.find({where: {isActive: true},skip: offset, take: limit});
    return res.json(users);
};

export { findAll };