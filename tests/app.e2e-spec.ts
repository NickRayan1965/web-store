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
import { Encrypter } from '../src/common/helpers/encrypter.helper';
import { CreateUserDto } from '../src/dto/create-user.dto';
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
        const checkUserInDbByEmail = async (email: string): Promise<boolean> => {
            return Boolean(
                await authRepo.findOne({where: {email}})
            );
        };
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
            describe('Todo correcto, pero con credenciales inexistentes.', ()=>{
                it('deberia devolver un status 401', async ()=> {
                    const inexistingCredential: LoginUserDto = {
                        email: 'xxxxxxxxxxx',
                        password: 'xxxxxxxxxxxx',
                    }
                    const exist_before = await checkUserInDbByEmail(inexistingCredential.email);
                    const {body, status} = await requestLogin(inexistingCredential);
                    const {user, jwt} = body;
                    expect(exist_before).toBeFalsy();
                    expect(status).toBe(HttpStatus.UNAUTHORIZED);
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                });
            });
            describe('Sin enviar password (campo requerido) y con un email que si existe', () => {
                it('deberia devolver un status 400', async () => {
                    const userRequest = {email: usersInDbAndJwts.admin.credential.email};
                    const { body, status } = await requestLogin(userRequest);
                    const { user, jwt } = body;
                    expect(status).toBe(HttpStatus.BAD_REQUEST);
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                });
            });
            describe('Enviando email existente pero con una contraseña incorrecta', () => {
                it('deberia devolver un status 401', async () => {
                    const userRequest = usersInDbAndJwts.admin.credential;
                    userRequest.password = 'cualquier password 12';
                    const areDifferentPwds = !Encrypter.checkPassword(
                        userRequest.password,
                        usersInDbAndJwts.admin.data.password,
                    );
                    const { body, status } = await requestLogin(userRequest);
                    const { user, jwt } = body;
                    expect(areDifferentPwds).toBeTruthy();
                    expect(status).toBe(HttpStatus.UNAUTHORIZED);
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                });
            });
            describe('Todo correcto, credenciales de usuario existentes, pero con campos extras que no deberian enviarse', () => {
                it('deberia devolver un status 400', async () => {
                    const userRequest = {
                        ...usersInDbAndJwts.admin.credential,
                        campoExtra: 12
                    };
                    const { body, status } = await requestLogin(userRequest);
                    const { user, jwt } = body;
                    expect(status).toBe(HttpStatus.BAD_REQUEST);
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                });
            });
        });
        describe('/POST /register', () => {
            const requestRegister = async (
                jwt: string,
                user_to_create: Partial<CreateUserDto>,
            ) => {
                return await request(app)
                    .post(`${pathRoute}/register`)
                    .set('Authorization', `Bearer ${jwt}`)
                    .send(user_to_create);
            };
            beforeAll(async ()=>{
                await cleanDb(AppDataSource);    
                usersInDbAndJwts = await saveUsersInDbAndGetThemWithJwts(AppDataSource, jwtService);
            });
        });
    });
});