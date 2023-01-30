import app from '../src/app';
import request from 'supertest';
import { AppDataSource } from '../src/database/db';
import { LoginUserDto } from '../src/dto/login-user.dto';
import { User } from '../src/entities/user.entity';
import { StatusCodes as HttpStatus} from 'http-status-codes';
import { cleanDb } from './helpers/cleanDb.helper';
import { UsersAndJwts } from './interfaces/users-and-jwts.interface';
import { saveUsersInDbAndGetThemWithJwts } from './helpers/save-users-in-db-and-get-them-with-jwts.helper';
import jwtService from '../src/common/helpers/jwt';
import { toJSON } from '../src/common/helpers/to-json.helper';
describe('TDD with e2e Testing', () => {
    let usersInDbAndJwts: UsersAndJwts;
    beforeAll(async()=>{
        await AppDataSource.initialize();        
    });
    afterAll(async()=>{
        await cleanDb(AppDataSource);
        await AppDataSource.destroy();
    });
    describe('/Auth', () => {
        const pathRoute = '/auth';
        const authRepo = AppDataSource.getRepository(User);
        describe('/GET /login', () => {
            const requestLogin = async (loginUserDto: Partial<LoginUserDto>) => {
                return await request(app).get(`${pathRoute}/login`).send(loginUserDto);
            };
            beforeAll(async ()=>{
                await cleanDb(AppDataSource);    
                usersInDbAndJwts = await saveUsersInDbAndGetThemWithJwts(AppDataSource, jwtService);
            });
            describe('Todo correcto, con credenciales existentes.', ()=>{
                it('deberia devolver un status 200, el registro del usuario y su jwt', async ()=> {
                    const userRequest = usersInDbAndJwts.admin;
                    const {body, status} = await requestLogin(userRequest.credential);
                    const {user: userResponse, jwt} = body;
                    expect(status).toBe(HttpStatus.OK);
                    expect(userResponse).toStrictEqual(toJSON(userRequest.credential));
                    expect(jwtService.verify(jwt)).toBeTruthy();
                    expect(jwtService.decode(jwt)).toBe(userRequest.data.id);
                });
            });
        });
    });
});