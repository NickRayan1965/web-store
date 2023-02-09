import { DataSource, DataSourceOptions } from 'typeorm'
import { User } from '../entities/user.entity';
import EnvConfiguration from '../config/app.config';
const {NODE_ENV} = EnvConfiguration;
const dataSourceOptions: DataSourceOptions = { type: 'postgres', ...EnvConfiguration[NODE_ENV], port: +EnvConfiguration[NODE_ENV].port, entities: [User], synchronize: true};
export const AppDataSource = new DataSource(dataSourceOptions);