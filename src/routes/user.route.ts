import { Router } from 'express';
import { ValidateQueryParams } from '../common/middlewares/validate-query.middleware';
import { BasicQueryParams } from '../dto/basic-query-params.dto';
import { findAll, findById, updateUserById, deleteUserById } from '../controllers/user.controller';
import Auth from '../common/middlewares/auth.middleware';
import { ValidRoles } from '../interfaces/valid_roles.interface';
import routeParamUUIDValidation from '../common/middlewares/route-param-uuid-validation.middleware';
import { validateDTO2 } from '../common/middlewares/validate-dto2.middleware';
import { UpdateUserDto } from '../dto/update-user.dto';
const userRouter = Router();
userRouter.get(
    '',
    Auth(ValidRoles.admin),ValidateQueryParams(BasicQueryParams),
    findAll
);
userRouter.get('/:id', Auth(), routeParamUUIDValidation('id'), findById);
userRouter.patch('/:id', Auth(), routeParamUUIDValidation('id'), validateDTO2(UpdateUserDto), updateUserById);
userRouter.delete('/:id', Auth(), routeParamUUIDValidation('id'), deleteUserById)
export default userRouter;