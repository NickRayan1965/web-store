import { Request, Response } from 'express';
import EnvConfiguration from '../config/app.config';
import { Brand } from '../entities/brand.entity';
import { AppDataSource } from '../database/db';
import { BasicQueryParams } from '../dto/basic-query-params.dto';
const {LIMIT,OFFSET} = EnvConfiguration;
const brandRepository = AppDataSource.getRepository(Brand);
const nameEntity = Brand.name;
export const getAllBrands = async (req: Request, res: Response) => {
    const {limit = +LIMIT, offset = +OFFSET} = res.locals.query as BasicQueryParams;
    const brands = await brandRepository.find({where: {isActive: true},skip: offset, take: limit});
    return res.json(brands);
};