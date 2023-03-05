import { Response } from 'express';
import { HttpStatus, ReasonPhrases } from './http-status.helper';
export const HttpReponse = {
    [HttpStatus.UNAUTHORIZED]: (res: Response, message?: string | string[]) => {
        return res.status(HttpStatus.UNAUTHORIZED).json({
           statusCode: HttpStatus.UNAUTHORIZED,
           error: ReasonPhrases.UNAUTHORIZED,
           message 
        });
    },
    [HttpStatus.FORBIDDEN]: (res: Response, message?: string | string[]) => {
        return res.status(HttpStatus.FORBIDDEN).json({
           statusCode: HttpStatus.FORBIDDEN,
           error: ReasonPhrases.FORBIDDEN, 
           message,
        });
    },
    [HttpStatus.BAD_REQUEST]: (res: Response, message?: string | string[]) => {
        return res.status(HttpStatus.BAD_REQUEST).json({
           statusCode: HttpStatus.BAD_REQUEST,
           error: ReasonPhrases.BAD_REQUEST, 
           message,
        });
    },
    [HttpStatus.INTERNAL_SERVER_ERROR]: (res: Response, message?: string | string[]) => {
        HttpStatus[""]
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: ReasonPhrases.INTERNAL_SERVER_ERROR, 
            message,
         });
    },
    [HttpStatus.NOT_FOUND]: (res: Response, message?: string | string[]) => {
        HttpStatus[""]
        return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            error: ReasonPhrases.NOT_FOUND, 
            message,
         });
    },
    [HttpStatus.NO_CONTENT]: (res: Response, message?: string | string[]) => {
        HttpStatus[""]
        return res.status(HttpStatus.NO_CONTENT).json({
            statusCode: HttpStatus.NO_CONTENT,
            error: ReasonPhrases.NO_CONTENT, 
            message,
         });
    },
};
export default HttpReponse;