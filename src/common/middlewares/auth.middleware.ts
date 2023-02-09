import { NextFunction, Request, Response } from 'express';
import { StatusCodes as HttpStatus} from 'http-status-codes';
import { ValidRoles } from '../../interfaces/valid_roles.interface';
import jwtService from '../helpers/jwt';
import HttpReponse from '../helpers/http-response';
import { AppDataSource } from '../../database/db';
import { User } from '../../entities';
const userRepo = AppDataSource.getRepository(User);
const Auth = (...validRoles: ValidRoles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const jwt = (req.headers['authorization'] as String)?.split(' ')[1];
        if (!jwtService.verify(jwt))
            return HttpReponse[HttpStatus.UNAUTHORIZED](res);
        const user_id = jwtService.decode(jwt).userId;
        const user = await userRepo.findOne({where: {id: user_id}});
        if (!user) return HttpReponse[HttpStatus.UNAUTHORIZED](res);
        if (!user.isActive) return HttpReponse[HttpStatus.UNAUTHORIZED](res, "3");
        if(user.roles.length == 0) return HttpReponse[HttpStatus.UNAUTHORIZED](res, "4");

        if(validRoles.length > 0 && !user.roles.some(role => validRoles.includes(role))) return HttpReponse[HttpStatus.FORBIDDEN](res, 'User needs a valid role');
        res.locals.user = user as User;
        next();
    }
}
export default Auth;