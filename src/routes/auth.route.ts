import { Router } from 'express';
import { CreateUserDto} from '../dto/create-user.dto';
import { createAdminUser, login, createCustomerUser } from '../controllers/auth.controller';
import { validateDTO2 } from '../common/middlewares/validate-dto2.middleware';
import { ValidRoles } from '../interfaces/valid_roles.interface';
import Auth from '../common/middlewares/auth.middleware';
import { LoginUserDto } from '../dto/login-user.dto';

const authRouter = Router();
authRouter.post('/login', validateDTO2(LoginUserDto), login);
authRouter.post('/register/admin',
                validateDTO2(CreateUserDto),
               Auth(ValidRoles.admin),
                createAdminUser);
authRouter.post('/register/customer',
                validateDTO2(CreateUserDto),
                createCustomerUser);
export default authRouter;