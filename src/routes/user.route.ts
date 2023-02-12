import { Router } from 'express';
import { ValidateQueryParams } from '../common/middlewares/validate-query.middleware';
import { BasicQueryParams } from '../dto/basic-query-params.dto';
import { findAll } from '../controllers/user.controller';
import Auth from '../common/middlewares/auth.middleware';
import { ValidRoles } from '../interfaces/valid_roles.interface';
const userRouter = Router();
userRouter.get('', Auth(ValidRoles.admin),ValidateQueryParams(BasicQueryParams), findAll);
export default userRouter;