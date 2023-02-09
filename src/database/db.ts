import { DataSource, DataSourceOptions } from 'typeorm'
import { User } from '../entities/user.entity';
import EnvConfiguration from '../config/app.config';
const {NODE_ENV, DB_HOST, DEV_DB_HOST,DEV_DB_NAME, DEV_POSTGRES_PASSWORD, DEV_POSTGRES_USER,DB_NAME,POSTGRES_PASSWORD,POSTGRES_USER, DEV_DB_PORT,DB_PORT} = EnvConfiguration;
const IS_DEVELOPMENT = NODE_ENV === 'development';
const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: IS_DEVELOPMENT ? DEV_DB_HOST : DB_HOST,
    username: IS_DEVELOPMENT ? DEV_POSTGRES_USER : POSTGRES_USER,
    password: IS_DEVELOPMENT ? DEV_POSTGRES_PASSWORD : POSTGRES_PASSWORD,
    port: IS_DEVELOPMENT ? +DEV_DB_PORT : +DB_PORT,
    database: IS_DEVELOPMENT ? DEV_DB_NAME : DB_NAME,
    entities: [User],
    synchronize: true,
};
export const AppDataSource = new DataSource(dataSourceOptions);