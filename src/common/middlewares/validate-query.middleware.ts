import { plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, Response } from 'express';
import { HasConstructor } from '../../interfaces/has-constructor.interface';
import { getErrorMessages } from './validate-dto2.middleware';
import HttpReponse from '../helpers/http-response';
import { HttpStatus } from '../helpers/http-status.helper';
export const ValidateQueryParams = <T extends HasConstructor>(instanciable: T) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToClass(instanciable, req.query, {
            exposeDefaultValues: true,
            enableImplicitConversion: true,
        });
        const errors: ValidationError[] = await validate(dtoInstance, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        const arrayOfErrors: string[] = [].concat(...errors.map(error => getErrorMessages(error)));
        if (errors.length > 0) {
            return HttpReponse[HttpStatus.BAD_REQUEST](res, arrayOfErrors);
        }
        res.locals.query = dtoInstance;
        next();
    }
};
