import AppExpress from '../src/app';
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
import { stubAdminUser } from './stub/user.stub';
import { ValidRoles } from '../src/interfaces/valid_roles.interface';
describe('TDD with e2e Testing', () => {
    let usersInDbAndJwts: UsersAndJwts;
    let jwt_admin: string;
    let jwt_customer: string;
    let jwt_no_roles: string;
    let server: any;
    beforeAll(async()=>{
        server = AppExpress.listen(3000);
        await AppDataSource.initialize();
        const repo = AppDataSource.getRepository(User);
        const userToCreate = stubAdminUser({undefined_id: true}, {roles: [ValidRoles.customer]});
        await repo.save(userToCreate);
        const users = await repo.find({});
        console.log({users});
        await cleanDb(AppDataSource);        
    });
    afterAll(async()=>{
        await cleanDb(AppDataSource);
        await AppDataSource.destroy();
        server.close();
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
                return await request(server).post(`${pathRoute}/login`).send(loginUserDto);
            };
            beforeAll(async ()=>{
                await cleanDb(AppDataSource);    
                usersInDbAndJwts = await saveUsersInDbAndGetThemWithJwts(AppDataSource, jwtService);
                console.log({usersInDbAndJwts, userDb: usersInDbAndJwts.admin.data});
                jwt_admin = usersInDbAndJwts.admin.jwt;
                jwt_customer = usersInDbAndJwts.customer.jwt;
                jwt_no_roles = usersInDbAndJwts.noRoles.jwt;
            });
            describe('Todo correcto, con credenciales existentes.', ()=>{
                it('deberia devolver un status 200, el registro del usuario y su jwt', async ()=> {
                    const userRequest = usersInDbAndJwts.admin;
                    const {body, status} = await requestLogin(userRequest.credential);
                    const {user: userResponse, jwt} = body;
                    console.log({body, status});
                    expect(status).toBe(HttpStatus.OK);
                    expect(userResponse).toStrictEqual(toJSON(userRequest.data));
                    expect(jwtService.verify(jwt)).toBeTruthy();
                    expect(jwtService.decode(jwt).userId).toBe(userRequest.data.id);
                });
            });
            describe('Todo correcto, pero con credenciales inexistentes.', ()=>{
                it('deberia devolver un status 401', async ()=> {
                    const inexistingCredential: LoginUserDto = {
                        email: 'exampleNoexiste12@gmail.com',
                        password: 'xxxxxxxxxxxxxxx',
                    }
                    const exists_before = await checkUserInDbByEmail(inexistingCredential.email);
                    const {body, status} = await requestLogin(inexistingCredential);
                    const {user, jwt} = body;
                    expect(exists_before).toBeFalsy();
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
        describe('/POST /register/admin (Create User with "admin" role)', () => {
            const requestRegisterAdmin = async (
                jwt: string,
                user_to_create: Partial<CreateUserDto>,
            ) => {
                return await request(server)
                    .post(`${pathRoute}/register/admin`)
                    .set('Authorization', `Bearer ${jwt}`)
                    .send(user_to_create);
            };
            beforeAll(async ()=>{
                await cleanDb(AppDataSource);    
                usersInDbAndJwts = await saveUsersInDbAndGetThemWithJwts(AppDataSource, jwtService);
                jwt_admin = usersInDbAndJwts.admin.jwt;
                jwt_customer = usersInDbAndJwts.customer.jwt;
                jwt_no_roles = usersInDbAndJwts.noRoles.jwt;
            });
            describe('Todo correcto, todos los campos y el jwt de un admin (📋✅) (🔐✅)', () => {
                it('deberia devolver un status 201, el registro del usuario y un nuevo jwt valido', async () => {
                    const userToCreate = stubAdminUser({undefined_id: true});

                    const exists_before = await checkUserInDbByEmail(userToCreate.email);
                    
                    const {body, status} = await requestRegisterAdmin(jwt_admin, userToCreate);
                    const { user, jwt } = body;

                    const exists_after = await checkUserInDbByEmail(userToCreate.email);

                    const pwd_encrypted: string = user.password;
                    user.password = userToCreate.password;
                    const isPasswordCorrect = Encrypter.checkPassword(
                        userToCreate.password,
                        pwd_encrypted,
                    );
                    expect(exists_before).toBeFalsy();
                    expect(exists_after).toBeTruthy();
                    expect(status).toBe(HttpStatus.CREATED);
                    expect(user).toStrictEqual(toJSON(user));
                    expect(isPasswordCorrect).toBeTruthy()
                    expect(jwtService.verify(jwt)).toBeTruthy();
                    expect(jwtService.decode(jwt).userId).toBe(user.id);
                });
            });
            describe('Todo correcto, todos los campos pero el jwt no tiene roles (📋✅) (🔐❌)', () => {
                it('deberia devolver un status 401', async ()=> {
                    const userToCreate = stubAdminUser({undefined_id: true})
                    const exists_before = await checkUserInDbByEmail(userToCreate.email);
                    const {body,status} = await requestRegisterAdmin(jwt_no_roles, userToCreate);
                    const exists_after = await checkUserInDbByEmail(userToCreate.email);

                    const {user,jwt} = body;
                    expect(exists_before).toBeFalsy();
                    expect(exists_after).toBeFalsy();
                    expect(status).toBe(HttpStatus.UNAUTHORIZED);
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                });
            });
            describe('Sin enviar un campo obligatorio, con un jwt admin (📋❌) (🔐✅)', () => {
                it('deberia devolver un status 400', async ()=>{
                    const userToCreate: Partial<User> = {...stubAdminUser({undefined_id: true}), dni: undefined};
                    const exists_before = await checkUserInDbByEmail(userToCreate.email!);
                    const {body,status} = await requestRegisterAdmin(jwt_admin, userToCreate);
                    const {user,jwt} = body;
                    const exist_after = await checkUserInDbByEmail(userToCreate.email!);
                    expect(exists_before).toBeFalsy();
                    expect(exist_after).toBeFalsy();
                    expect(status).toBe(HttpStatus.BAD_REQUEST);
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                })
            });
            describe('Enviando algunos campos incorrectos y con un jwt admin (📋❌) (🔐✅)', () => {
                it('deberia devolver un status 400', async ()=>{
                    const userToCreate: Partial<User> = {...stubAdminUser({undefined_id: true},{dni: '12312321312312321321321312dnimalo', sex: 'sexo no valido'})};
                    const exists_before = await checkUserInDbByEmail(userToCreate.email!);
                    const {body,status} = await requestRegisterAdmin(jwt_admin, userToCreate);
                    const {user,jwt} = body;
                    const exist_after = await checkUserInDbByEmail(userToCreate.email!);
                    expect(exists_before).toBeFalsy();
                    expect(exist_after).toBeFalsy();
                    expect(status).toBe(HttpStatus.BAD_REQUEST);
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                })
            });
            describe('Enviando algunos campos extras (que no deberian estar) y con un jwt admin  (📋❌) (🔐✅)', () => {
                it('deberia devolver un status 400', async ()=>{
                    const userToCreate = {...stubAdminUser({undefined_id: true}),campo_extra: 'dea'};
                    const exists_before = await checkUserInDbByEmail(userToCreate.email!);
                    const {body,status} = await requestRegisterAdmin(jwt_admin, userToCreate);
                    const {user,jwt} = body;
                    const exist_after = await checkUserInDbByEmail(userToCreate.email!);
                    expect(exists_before).toBeFalsy();
                    expect(exist_after).toBeFalsy();
                    expect(status).toBe(HttpStatus.BAD_REQUEST);
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                })
            });
            describe('Enviando un email que ya esta registrado (datos validos) con un jwt admin (📋❌) (✅🔐)', () => {
                it('deberia devolver un status 400', async () => {
                    const userInDb = {...usersInDbAndJwts.customer.data, id: undefined};
                    const {body,status} = await requestRegisterAdmin(jwt_admin, userInDb);
                    const {user, jwt} = body;
                    expect(status).toBe(HttpStatus.BAD_REQUEST);
                    expect(user).toBeUndefined(); 
                    expect(jwt).toBeUndefined(); 
                });
            })
        });
        describe('/POST /register/customer', ()=>{
            const requestRegisterCustomer = async (
                 user_to_create: Partial<CreateUserDto>,
             ) => {
                 return await request(server)
                     .post(`${pathRoute}/register/customer`)
                     .send(user_to_create);
             };
             beforeAll(async ()=>{
                 await cleanDb(AppDataSource);    
                 usersInDbAndJwts = await saveUsersInDbAndGetThemWithJwts(AppDataSource, jwtService);
                 jwt_admin = usersInDbAndJwts.admin.jwt;
                 jwt_customer = usersInDbAndJwts.customer.jwt;
                 jwt_no_roles = usersInDbAndJwts.noRoles.jwt;
             });
             describe('Datos correctos (📋✅)', ()=>{
                 it('deberia devolver un status 201, el registro del usuario y su jwt', async()=>{
                     const userToCreate = stubAdminUser({undefined_id: true}, {roles: [ValidRoles.customer]});
                     const {body,status} = await requestRegisterCustomer(userToCreate);
                     const {user,jwt}=body;
                     userToCreate.password = Encrypter.encrypt(userToCreate.password);
                     const isPasswordCorrect = Encrypter.checkPassword(userToCreate.password, user.password);
                     userToCreate.password = user.password;
                     const exists_after = await checkUserInDbByEmail(userToCreate.email);
                     expect(status).toBe(HttpStatus.CREATED);
                     expect(exists_after).toBeTruthy();
                     expect(userToCreate).toStrictEqual(toJSON(user));
                     expect(jwtService.verify(jwt)).toBeTruthy();
                     expect(jwtService.decode(jwt).userId).toBe(user.id);
                     expect(isPasswordCorrect).toBeTruthy();
                 });
             });
             describe('Datos con campos incorrectos (📋❌)', ()=>{
                it('deberia devolver un status 400', async()=>{
                    const userToCreate = stubAdminUser({undefined_id: true}, {roles: [ValidRoles.customer], dni: 13213 as any, first_names: 1312312 as any});
                    const {body,status} = await requestRegisterCustomer(userToCreate);
                    const {user,jwt}=body;
                    const exist_after = await checkUserInDbByEmail(userToCreate.email);
                    expect(status).toBe(HttpStatus.BAD_REQUEST);
                    expect(exist_after).toBeFalsy();
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                });
            });
            describe('Datos con campos extras que no existen (📋❌)', ()=>{
                it('deberia devolver un status 400', async()=>{
                    const userToCreate = {...stubAdminUser({undefined_id: true}, {roles: [ValidRoles.customer]}), campoExtra: 123};
                    const {body,status} = await requestRegisterCustomer(userToCreate);
                    const {user,jwt}=body;
                    const exist_after = await checkUserInDbByEmail(userToCreate.email);
                    expect(status).toBe(HttpStatus.BAD_REQUEST);
                    expect(exist_after).toBeFalsy();
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                });
            });
            describe('Datos con campos extras que no existen (📋❌)', ()=>{
                it('deberia devolver un status 400', async()=>{
                    const userToCreate = {...stubAdminUser({undefined_id: true}, {roles: [ValidRoles.customer]}), campoExtra: 123};
                    const {body,status} = await requestRegisterCustomer(userToCreate);
                    const {user,jwt}=body;
                    const exist_after = await checkUserInDbByEmail(userToCreate.email);
                    expect(status).toBe(HttpStatus.BAD_REQUEST);
                    expect(exist_after).toBeFalsy();
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                });
            });
            describe('Datos con un email que ya existe (📋❌)', ()=>{
                it('deberia devolver un status 400', async()=>{
                    const existing_email = usersInDbAndJwts.admin.data.email;
                    const userToCreate = stubAdminUser({undefined_id: true}, {roles: [ValidRoles.customer], email: existing_email});
                    const {body,status} = await requestRegisterCustomer(userToCreate);
                    const {user,jwt}=body;
                    expect(status).toBe(HttpStatus.BAD_REQUEST);
                    expect(user).toBeUndefined();
                    expect(jwt).toBeUndefined();
                });
            });
         });
    });
});