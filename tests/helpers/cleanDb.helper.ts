import { DataSource } from 'typeorm';
export const cleanDb = async (appDataSource: DataSource)=>{
    await appDataSource.dropDatabase();
    await appDataSource.destroy();
    await appDataSource.initialize();
};