import { plainToClass, plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, Response } from 'express';
import { BaseUserDto, LoginUserDto } from "../../dto";



export const validateDTO = (dtoClass: typeof BaseUserDto) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const dtoInstance = plainToClass(dtoClass, req.body, {
            exposeDefaultValues: true,
            enableImplicitConversion: true,
        });
        const errors: ValidationError[] = await validate(dtoInstance, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        const arrayErrors = errors.reduce((array: any, error: ValidationError, index: Number) => {
            if (error.constraints)
                array.push({ property: error.property, ...error.constraints });
            return array
        }, [])
        if (errors.length > 0) {
            return res.status(400).send({ errors: arrayErrors });
        }
        next();
    }
};
