import { Response } from 'express';
import HttpReponse from '../helpers/http-response';
import { HttpStatus } from '../helpers/http-status.helper';
export const handleExceptions = (error: any, nameEntity: string, res: Response) => {
    if(error.code === '23505') return HttpReponse[HttpStatus.BAD_REQUEST](res, `'${nameEntity}' already exists in db ${JSON.stringify(error.detail)}`);
    return HttpReponse[HttpStatus.INTERNAL_SERVER_ERROR](res, `Cannot create or update the '${nameEntity}' - Check logs`);
} 