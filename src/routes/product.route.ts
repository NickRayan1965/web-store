import { Router } from "express";
import { validateDTO2 } from "../common/middlewares/validate-dto2.middleware";
import { CreateProductDto } from "../dto/create-product.dto";
import Auth from "../common/middlewares/auth.middleware";
import { ValidRoles } from "../interfaces/valid_roles.interface";
import { createProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller";
import { deleteProduct } from '../controllers/product.controller';
import routeParamUUIDValidation from '../common/middlewares/route-param-uuid-validation.middleware';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ValidateQueryParams } from '../common/middlewares/validate-query.middleware';
import { BasicQueryParams } from '../dto/basic-query-params.dto';
const productRoute = Router();
productRoute.post(
  "",
  //Auth(ValidRoles.admin) ,
  validateDTO2(CreateProductDto),
  createProduct
);
productRoute.get(
  '/:id',
  //Auth(ValidRoles.admin),
  routeParamUUIDValidation('id'),
  getProductById,
);
productRoute.get(
  '',
  //Auth(ValidRoles.admin)
  ValidateQueryParams(BasicQueryParams),
  getProducts,
);
productRoute.patch(
  "/:id",
  //Auth(ValidRoles.admin),
  routeParamUUIDValidation('id'),
  validateDTO2(UpdateProductDto),
  updateProduct
);
productRoute.delete(
  '/:id',
  //Auth(ValidRoles.admin),
  routeParamUUIDValidation('id'),
  deleteProduct
);
export default productRoute;
