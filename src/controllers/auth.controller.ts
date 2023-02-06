import { Request, Response } from 'express';

import { User } from '../entities';
import { Encrypter } from '../common/helpers/encrypter.helper';
import jwtService from '../common/helpers/jwt';
import httpStatus from 'http-status-codes';

const findAll = async (_: Request, res: Response) => {
};
const createUser = async (req: Request, res: Response) => {
};

const signIn = async (req: Request, res: Response) => {
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
}



export { findAll, createUser, signIn };