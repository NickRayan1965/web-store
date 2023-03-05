import { plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, Response } from 'express';
import { HasConstructor } from '../../interfaces/has-constructor.interface';
import HttpReponse from '../helpers/http-response';
import { HttpStatus } from '../helpers/http-status.helper';
export function getErrorMessages(error: ValidationError, errorMsg?: string) {
    let errorMessages: string[] = [];
    if(!error.children.length) {
        const constraintKeys = Object.keys(error.constraints);
        for(const k of constraintKeys) {
            const msgProperty = error.constraints[k];
            errorMessages.push(errorMsg ? `${errorMsg}, ${msgProperty}` : msgProperty);
        }
        return errorMessages;
    }
    errorMsg = errorMsg ? `${errorMsg}[${error.property}]`: `In ${error.property}`;
    for(const e of error.children) {
        const errorMessagesB = getErrorMessages(e, errorMsg)
        errorMessages.push(...errorMessagesB);
    }
    return errorMessages;
}
export const validateDTO2 = <T extends HasConstructor>(instanciable: T) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToClass(instanciable, req.body, {
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
        res.locals.data = dtoInstance;
        next();
    }
};
