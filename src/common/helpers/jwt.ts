import jwt from 'jsonwebtoken';
import {JwtPayload} from '../../interfaces/jwt-payload.interface';
export class JWT_Service {
    private readonly secret: string;
    private readonly jwt = jwt;
    constructor(secret: string) {
        this.secret = secret;
    }
    sign(payload: JwtPayload): string {
        return this.jwt.sign(payload, this.secret, {expiresIn: '1d'});
    }
    verify(token: string): boolean {
        try {
            this.jwt.verify(token, this.secret);
            return true;
        } catch (error) {
            return false;
        }
    }
    decode(token: string): JwtPayload {
        return this.jwt.decode(token) as JwtPayload;
    }
}
const jwtService = new JWT_Service(process.env.SECRET_KEY!);
export default jwtService;