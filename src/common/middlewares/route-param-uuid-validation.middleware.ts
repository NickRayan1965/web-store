import { NextFunction, Request, Response } from 'express';
import HttpReponse from '../helpers/http-response';
import { HttpStatus } from '../helpers/http-status.helper';
import { isUUID } from 'class-validator';

const routeParamUUIDValidation = (nameParam: string) => (req: Request, res: Response, next: NextFunction) => {
    const param = req.params[nameParam];
    if (!param) return HttpReponse[HttpStatus.BAD_REQUEST](res);
    if (!isUUID(param, '4')) return HttpReponse[HttpStatus.BAD_REQUEST](res, `'${nameParam}' should be a valid uuid`);
    res.locals.params = res.locals.params || {};
    res.locals.params[nameParam] = param;
    next();
}
export default routeParamUUIDValidation;