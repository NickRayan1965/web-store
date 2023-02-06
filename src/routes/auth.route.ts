import express, { Router } from 'express';
import { validateDTO } from '../common/middlewares/validate-dto';
import { LoginUserDto } from '../dto';
import { signIn } from '../controllers/auth.controller';

const authRouter = Router();
authRouter.post('/login', validateDTO(LoginUserDto),signIn)
export default authRouter;