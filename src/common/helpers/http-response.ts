import { Response } from 'express';
import { StatusCodes as HttpStatus, ReasonPhrases} from 'http-status-codes';

export const HttpReponse = {
    [HttpStatus.UNAUTHORIZED]: (res: Response, message?: string) => {
        return res.status(HttpStatus.UNAUTHORIZED).json({
           statusCode: HttpStatus.UNAUTHORIZED,
           message: message || ReasonPhrases.UNAUTHORIZED, 
        });
    },
    [HttpStatus.FORBIDDEN]: (res: Response, message?: string) => {
        return res.status(HttpStatus.FORBIDDEN).json({
           statusCode: HttpStatus.FORBIDDEN,
           message: message || ReasonPhrases.FORBIDDEN, 
        });
    }
};
export default HttpReponse;