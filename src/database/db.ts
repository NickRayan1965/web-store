import { DataSource } from 'typeorm'
import { User } from '../entities/user.entity';
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'db',
    username: 'nick',
    password: '1234',
    port: 5432,
    database: process.env.DB_NAME || 'postgres',
    entities: [User],
    synchronize: true,
});