import { DataSource } from 'typeorm'
import { User } from '../entities/user.entity';
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'nick',
    password: '1234',
    port: 5432,
    database: 'postgres',
    entities: [User],
    synchronize: true,
});