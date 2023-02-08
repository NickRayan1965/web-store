import { Request, Response } from 'express';

import { User } from '../entities';
import { Encrypter } from '../common/helpers/encrypter.helper';
import jwtService from '../common/helpers/jwt';
import { LoginUserDto } from '../dto';
import { AppDataSource } from '../database/db';
import HttpReponse from '../common/helpers/http-response';
import { StatusCodes as HttpStatus} from 'http-status-codes';
import { CreateOrLoginResponseDto } from '../dto/create-or-login-response.dto';
const userRepo = AppDataSource.getRepository(User);

const findAll = async (_: Request, res: Response) => {
};
const createUser = async (req: Request, res: Response) => {
};

/* const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body
    let user: User | null;
    try {
        user = await User.findOneBy({ email })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Unexpected error, check server logs' });   
    }
    
    if (!user) return res.status(httpStatus.UNAUTHORIZED).json({
         message: 'Credentials are not valid (username)', statusCode: httpStatus.UNAUTHORIZED,
         timestamp: new Date().toISOString(),
         });
    if (!Encrypter.checkPassword(password, user.password)) return res.status(httpStatus.UNAUTHORIZED).json({ 
        message: 'Credentials are not valid (password)', statusCode: httpStatus.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
     });
    res.status(httpStatus.OK).json({
        ...user,
        token: jwtService.sign({ userId: user.id })
    })
} */

const login = async (req: Request, res: Response) => {
    const {email, password} = res.locals.data as LoginUserDto;
    const user = await userRepo.findOne({where: { email: email}});
    if (!user) return HttpReponse[HttpStatus.UNAUTHORIZED](res, "Credentials aren't valid");
    if (!Encrypter.checkPassword(password, user.password)) return HttpReponse[HttpStatus.UNAUTHORIZED](res, "Credentials aren't valid");
    if(!user.isActive) return HttpReponse[HttpStatus.UNAUTHORIZED](res, "User inactive");
    const loginUserReponse: CreateOrLoginResponseDto = {
        user,
        jwt: jwtService.sign({userId: user.id}),
    };
    return res.json(loginUserReponse);
}

export { findAll, createUser, /*signIn,*/ login };