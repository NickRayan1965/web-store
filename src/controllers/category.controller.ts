import { Request, Response } from 'express';
import EnvConfiguration from '../config/app.config';
import { AppDataSource } from '../database/db';
import { BasicQueryParams } from '../dto/basic-query-params.dto';
import { Category } from '../entities';
const {LIMIT,OFFSET} = EnvConfiguration;
const categoryRepository = AppDataSource.getRepository(Category);
const nameEntity = Category.name;
export const getAllCategories = async (req: Request, res: Response) => {
    const {limit = +LIMIT, offset = +OFFSET} = res.locals.query as BasicQueryParams;
    const categories = await categoryRepository.find({where: {isActive: true},skip: offset, take: limit});
    return res.json(categories);
};