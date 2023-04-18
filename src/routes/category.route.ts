import { Router } from "express";
import { validateDTO2 } from "../common/middlewares/validate-dto2.middleware";
import { CreateProductDto } from "../dto/create-product.dto";
import Auth from "../common/middlewares/auth.middleware";
import { ValidRoles } from "../interfaces/valid_roles.interface";
import { ValidateQueryParams } from '../common/middlewares/validate-query.middleware';
import { BasicQueryParams } from '../dto/basic-query-params.dto';
import { getAllCategories } from '../controllers/category.controller';
const categoryRouter = Router();
/* brandRouter.post(
  "",
  //Auth(ValidRoles.admin) ,
  validateDTO2(CreateProductDto),
  createProduct
);
brandRouter.get(
  '/:id',
  //Auth(ValidRoles.admin),
  routeParamUUIDValidation('id'),
  getProductById,
); */
categoryRouter.get(
  '',
  //Auth()
  ValidateQueryParams(BasicQueryParams),
  getAllCategories,
);
/* brandRouter.get(
  '/by/categories',
  //Auth(ValidRoles.admin)
  validateDTO2(CategoriesDto),
  getProductsByCategories,
);
brandRouter.patch(
  "/:id",
  //Auth(ValidRoles.admin),
  routeParamUUIDValidation('id'),
  validateDTO2(UpdateProductDto),
  updateProduct
);
brandRouter.delete(
  '/:id',
  //Auth(ValidRoles.admin),
  routeParamUUIDValidation('id'),
  deleteProduct
); */
export default categoryRouter;
