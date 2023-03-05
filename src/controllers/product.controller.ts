import { Request, Response } from 'express';
import { Category, Product } from '../entities';
import { CreateProductDto } from '../dto/create-product.dto';
import { AppDataSource } from '../database/db';
import { handleExceptions } from '../common/errors/handleExceptions';
import { HttpStatus } from '../common/helpers/http-status.helper';
import HttpReponse from '../common/helpers/http-response';
import { Brand } from '../entities/brand.entity';
import { isUUID } from 'class-validator';
import { UpdateProductDto } from '../dto/update-product.dto';
import { GetCategoriesObjFromList } from '../common/helpers/get-categories-obj-from-list.helper';
import EnvConfiguration from '../config/app.config';
import { BasicQueryParams } from '../dto/basic-query-params.dto';
const {LIMIT,OFFSET} = EnvConfiguration;

const productRepo = AppDataSource.getRepository(Product);
const productCategoryRepo = AppDataSource.getRepository(Category);
const brandRepo = AppDataSource.getRepository(Brand);

const nameEntity = Product.name;
const branEntity = Brand.name;
export const createProduct = async (req: Request, res: Response) => {
    const {categories: categoryList, brand: brandNameOrId,...restProductProperties} = res.locals.data as CreateProductDto;
    let brand: Brand;
    if(isUUID(brandNameOrId)) {
        brand = await brandRepo.findOneBy({id: brandNameOrId}) ;
        if(!brand) return HttpReponse[HttpStatus.NOT_FOUND](res,`There is not a ${branEntity} with id: '${brand}'`);
    }else{
        brand = await brandRepo.findOneBy({name: brandNameOrId}) || brandRepo.create({name: brandNameOrId});
    }
    let categories: Category[];
    try {
        categories = await GetCategoriesObjFromList(categoryList, productCategoryRepo);
    } catch (error: any) {
        return HttpReponse[HttpStatus.NOT_FOUND](res, error.message);
    }
    const product = productRepo.create({ ...restProductProperties, brand, categories});
    try {
        const productCreated = await productRepo.save(product);
        return res.status(HttpStatus.CREATED).json(productCreated)
    } catch (error) {
        return handleExceptions(error, nameEntity, res);
    }
    
};
export const getProductById = async(req: Request, res: Response) => {
    const product_id: string = res.locals.params.id;
    let productInDb = await productRepo.findOne({where:{id: product_id}, relations: {
        brand: true,
        categories: true,
        variations: true,
    }});
    if(!productInDb) return HttpReponse[HttpStatus.NOT_FOUND](res, `There is not an ${nameEntity} with id: '${product_id}'`);
    return res.json(productInDb);
};
export const getProducts = async(req: Request, res: Response) => {
    const {limit = +LIMIT, offset = +OFFSET} = res.locals.query as BasicQueryParams;
    const products = await productRepo.find({where: {isActive: true},skip: offset, take: limit, relations: {
        brand: true,
        categories: true,
        variations: true,
    }});
    return res.json(products);
};
export const updateProduct = async(req: Request, res: Response) => {
    const product_id: string = res.locals.params.id;
    let productInDb = await productRepo.findOne({where:{id: product_id}, relations: {
        brand: true,
        categories: true,
        variations: true,
    }});
    if(!productInDb) return HttpReponse[HttpStatus.NOT_FOUND](res, `There is not an ${nameEntity} with id: '${product_id}'`);

    const productUpdates: UpdateProductDto = res.locals.data;
    const {brand, categories, ...restUpdates} = productUpdates;
    let brandToSave: Brand;
    if(brand) {
        if(isUUID(brand)) {
            brandToSave = await brandRepo.findOneBy({id: brand});
            if(!brandToSave) return HttpReponse[HttpStatus.NOT_FOUND](res,`There is not a ${branEntity} with id: '${brand}'`);
        }else{
            brandToSave = await brandRepo.findOneBy({name: brand}) || brandRepo.create({name: brand});
        }
        productInDb.brand = brandToSave;
    }
    if(categories) {
        try {
            productInDb.categories = await GetCategoriesObjFromList(categories, productCategoryRepo);
        } catch (error: any) {
            return HttpReponse[HttpStatus.NOT_FOUND](res, error.message);
        }
    }
    productInDb = {...productInDb, ...restUpdates};
    try {
        productInDb = await productRepo.save(productInDb);
        return res.json(productInDb)
    } catch (error) {
        return handleExceptions(error, nameEntity, res);
    }
};
export const deleteProduct = async (req: Request, res: Response) => {
    const id: string = res.locals.params.id;
    const product = await productRepo.findOneBy({id});
    if(!product) return HttpReponse[HttpStatus.NOT_FOUND](res, `There is not an ${nameEntity} with id: '${id}'`);
    product.isActive = false;
    await productRepo.save(product);
    return HttpReponse[HttpStatus.NO_CONTENT](res);
};