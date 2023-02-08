import { Response } from 'express';
import { HttpStatus, ReasonPhrases } from './http-status.helper';
export const HttpReponse = {
    [HttpStatus.UNAUTHORIZED]: (res: Response, message?: string) => {
        return res.status(HttpStatus.UNAUTHORIZED).json({
           statusCode: HttpStatus.UNAUTHORIZED,
           error: ReasonPhrases.UNAUTHORIZED,
           message 
        });
    },
    [HttpStatus.FORBIDDEN]: (res: Response, message?: string) => {
        return res.status(HttpStatus.FORBIDDEN).json({
           statusCode: HttpStatus.FORBIDDEN,
           error: ReasonPhrases.FORBIDDEN, 
           message,
        });
    },
    [HttpStatus.BAD_REQUEST]: (res: Response, message?: string) => {
        return res.status(HttpStatus.BAD_REQUEST).json({
           statusCode: HttpStatus.BAD_REQUEST,
           error: ReasonPhrases.BAD_REQUEST, 
           message,
        });
    },
    [HttpStatus.INTERNAL_SERVER_ERROR]: (res: Response, message?: string) => {
        return res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            error: ReasonPhrases.BAD_REQUEST, 
            message,
         });
    },
    [HttpStatus.INTERNAL_SERVER_ERROR]: (res: Response, message?: string) => {
        HttpStatus[""]
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: ReasonPhrases.INTERNAL_SERVER_ERROR, 
            message,
         });
    },
};
export default HttpReponse;