import express, { Router } from 'express';
import { validateDTO } from '../common/middlewares/validate-dto.middleware';
import { LoginUserDto } from '../dto';
import { createUser, login } from '../controllers/auth.controller';
import { validateDTO2 } from '../common/middlewares/validate-dto2.middleware';

const authRouter = Router();
authRouter.post('/login', validateDTO2(LoginUserDto), login);
export default authRouter;