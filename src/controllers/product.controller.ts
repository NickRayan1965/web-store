import { Request, Response } from "express";
import { Category, Product, ProductVariation } from "../entities";
import { CreateProductDto } from "../dto/create-product.dto";
import { AppDataSource } from "../database/db";
import { handleExceptions } from "../common/errors/handleExceptions";
import { HttpStatus } from "../common/helpers/http-status.helper";
import HttpReponse from "../common/helpers/http-response";
import { Brand } from "../entities/brand.entity";
import { isBooleanString, isUUID } from "class-validator";
import { UpdateProductDto } from "../dto/update-product.dto";
import { GetCategoriesObjFromList } from "../common/helpers/get-categories-obj-from-list.helper";
import EnvConfiguration from "../config/app.config";
import { BasicQueryParams } from "../dto/basic-query-params.dto";
import { CategoriesDto } from "../dto/categories.dto";
import { CountQueryParams } from "../dto/count-quey-params.dto";
import { ILike } from "typeorm";
import { FindProductsQueryParamsDto } from "../dto/find-products-query-params.dto";
import { RawProduct, productConverterToRaw } from '../common/helpers/productConverterToRaw';
const { LIMIT, OFFSET } = EnvConfiguration;

const productRepo = AppDataSource.getRepository(Product);
const productCategoryRepo = AppDataSource.getRepository(Category);
const brandRepo = AppDataSource.getRepository(Brand);
const productVariationsRepo = AppDataSource.getRepository(ProductVariation);
const nameEntity = Product.name;
const branEntity = Brand.name;
export const getCount = async (req: Request, res: Response) => {
  let { isActive, titleFilter } = res.locals.query as CountQueryParams;
  isActive = isBooleanString(isActive) ? isActive === "true" : undefined;
  const count = await productRepo.count({
    where: {
      isActive,
      title: titleFilter ? ILike(`%${titleFilter}%`) : undefined,
    },
  });
  return res.json(count);
};
export const createProduct = async (req: Request, res: Response) => {
  const {
    categories: categoryList,
    brand: brandNameOrId,
    ...restProductProperties
  } = res.locals.data as CreateProductDto;
  let brand: Brand;
  if (isUUID(brandNameOrId)) {
    brand = await brandRepo.findOneBy({ id: brandNameOrId });
    if (!brand)
      return HttpReponse[HttpStatus.NOT_FOUND](
        res,
        `There is not a ${branEntity} with id: '${brand}'`
      );
  } else {
    brand =
      (await brandRepo.findOneBy({ name: brandNameOrId })) ||
      brandRepo.create({ name: brandNameOrId });
  }
  let categories: Category[];
  try {
    categories = await GetCategoriesObjFromList(
      categoryList,
      productCategoryRepo
    );
  } catch (error: any) {
    return HttpReponse[HttpStatus.NOT_FOUND](res, error.message);
  }
  const product = productRepo.create({
    ...restProductProperties,
    brand,
    categories,
  });
  try {
    const productCreated = await productRepo.save(product);
    return res.status(HttpStatus.CREATED).json(productCreated);
  } catch (error) {
    return handleExceptions(error, nameEntity, res);
  }
};
export const getProductById = async (req: Request, res: Response) => {
  const product_id: string = res.locals.params.id;
  let productInDb= await productRepo.findOne({
    where: { id: product_id },
    relations: {
      brand: true,
      categories: true,
      variations: true,
    },
  });
  if (!productInDb)
    return HttpReponse[HttpStatus.NOT_FOUND](
      res,
      `There is not an ${nameEntity} with id: '${product_id}'`
    );
  return res.json(productConverterToRaw(productInDb));
};
export const getProducts = async (_: Request, res: Response) => {
  const {
    limit = +LIMIT,
    offset = +OFFSET,
    titleFilter,
  } = res.locals.query as FindProductsQueryParamsDto;
  let { isActive, haveVariations } = res.locals
    .query as FindProductsQueryParamsDto;
  isActive = isBooleanString(isActive) ? isActive === "true" : undefined;
  haveVariations = isBooleanString(haveVariations)
    ? haveVariations === "true"
    : undefined;
  const subQuery = productVariationsRepo
    .createQueryBuilder("pv")
    .select("pv.product")
    .groupBy("pv.product")
    .getQuery();
  let productQuery = productRepo
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.brand", "brand")
    .leftJoinAndSelect("product.variations", "variations")
    .leftJoinAndSelect("product.categories", "category")
    .skip(offset * limit)
    .take(limit);
  if(haveVariations !== undefined) {
    productQuery = productQuery   
      .where(
      `product.id ${!haveVariations ? "NOT" : ""} IN (${subQuery})`
      ); 
  }
  if(isActive !== undefined ) {
    productQuery = productQuery.andWhere({isActive});
  }
  if(titleFilter) {
    productQuery = productQuery.andWhere({title: ILike(`%${titleFilter}%`)});
  }
  const products = await productQuery.getMany();
  return res.json(productConverterToRaw(products));
};

export const getProductsByCategories = async (_: Request, res: Response) => {
  const categoryNames = (res.locals.data as CategoriesDto).categories;
  const products = await productRepo
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.brand", "brand")
    .leftJoinAndSelect("product.variations", "variations")
    .leftJoinAndSelect("product.categories", "category")
    .where((qb) => {
      const subQuery = qb
        .subQuery()
        .select("product.id")
        .from("product", "product")
        .leftJoin("product.categories", "category")
        .where("category.name IN (:...categoryNames)", { categoryNames })
        .groupBy("product.id")
        .having(`COUNT(product.id) = ${categoryNames.length}`)
        .getQuery();
      return `product.id IN ${subQuery}`;
    })
    .getMany();

  return res.json(productConverterToRaw(products));
};
export const updateProduct = async (_: Request, res: Response) => {
  const product_id: string = res.locals.params.id;
  let productInDb = await productRepo.findOne({
    where: { id: product_id },
    relations: {
      brand: true,
      categories: true,
      variations: true,
    },
  });
  if (!productInDb)
    return HttpReponse[HttpStatus.NOT_FOUND](
      res,
      `There is not an ${nameEntity} with id: '${product_id}'`
    );

  const productUpdates: UpdateProductDto = res.locals.data;
  const { brand, categories,...restUpdates } = productUpdates;
  let brandToSave: Brand;
  if (brand) {
    if (isUUID(brand)) {
      brandToSave = await brandRepo.findOneBy({ id: brand });
      if (!brandToSave)
        return HttpReponse[HttpStatus.NOT_FOUND](
          res,
          `There is not a ${branEntity} with id: '${brand}'`
        );
    } else {
      brandToSave =
        (await brandRepo.findOneBy({ name: brand })) ||
        brandRepo.create({ name: brand });
    }
    productInDb.brand = brandToSave;
  }
  if (categories) {
    try {
      productInDb.categories = await GetCategoriesObjFromList(
        categories,
        productCategoryRepo
      );
    } catch (error: any) {
      return HttpReponse[HttpStatus.NOT_FOUND](res, error.message);
    }
  }
  productInDb = { ...productInDb, ...restUpdates as any };
  try {
    productInDb = await productRepo.save(productInDb);
    return res.json(productInDb);
  } catch (error) {
    return handleExceptions(error, nameEntity, res);
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  const id: string = res.locals.params.id;
  const product = await productRepo.findOneBy({ id });
  if (!product)
    return HttpReponse[HttpStatus.NOT_FOUND](
      res,
      `There is not an ${nameEntity} with id: '${id}'`
    );
  product.isActive = false;
  await productRepo.save(product);
  return HttpReponse[HttpStatus.NO_CONTENT](res);
};
