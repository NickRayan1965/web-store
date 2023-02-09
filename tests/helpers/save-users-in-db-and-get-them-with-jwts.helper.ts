import { DataSource } from "typeorm";
import { JWT_Service } from "../../src/common/helpers/jwt";
import { UsersAndJwts } from "../interfaces/users-and-jwts.interface";
import { stubAdminUser } from "../stub/user.stub";
import { LoginUserDto } from "../../src/dto/login-user.dto";
import { Encrypter } from "../../src/common/helpers/encrypter.helper";
import { ValidRoles } from "../../src/interfaces/valid_roles.interface";
import { User } from "../../src/entities/user.entity";

export const saveUsersInDbAndGetThemWithJwts = async (
  dbConnection: DataSource,
  jwtService: JWT_Service
): Promise<UsersAndJwts> => {
  // User with roles ["admin", "customer"]
  const userAdmin = stubAdminUser() as User;
  const credentialUserAdmin: LoginUserDto = {
    email: userAdmin.email,
    password: userAdmin.password,
  };
  userAdmin.password = Encrypter.encrypt(userAdmin.password);
  const jwtUserAdmin = jwtService.sign({ userId: userAdmin.id });

  // User with roles ["customer"]
  const userCustomer = stubAdminUser({}, { roles: [ValidRoles.customer] }) as User;
  const credencialUserCustomer: LoginUserDto = {
    email: userCustomer.email,
    password: userCustomer.password,
  };
  const jwtUserCustomer = jwtService.sign({ userId: userCustomer.id });

  // User without roles []
  const userNoRoles = stubAdminUser({}, { roles: [] }) as User;
  //userNoRoles.roles = [];
  const credencialUserNoRoles: LoginUserDto = {
    email: userNoRoles.email,
    password: userNoRoles.password,
  };
  const jwtUserNoRoles = jwtService.sign({ userId: userNoRoles.id });
  await dbConnection
    .getRepository(User)
    .insert([userAdmin, userCustomer, userNoRoles]);
  return {
    admin: {
      jwt: jwtUserAdmin,
      data: userAdmin,
      credential: credentialUserAdmin,
    },
    customer: {
      jwt: jwtUserCustomer,
      data: userCustomer,
      credential: credencialUserCustomer,
    },
    noRoles: {
      jwt: jwtUserNoRoles,
      credential: credencialUserNoRoles,
      data: userNoRoles,
    },
  };
};
