import { cleanDb } from '../tests/helpers/cleanDb.helper';
import app from './app';
import EnvConfiguration from './config/app.config';
import {AppDataSource} from './database/db';
async function main(){
    try{
        await AppDataSource.initialize();
        console.log("Database connected")
        app.listen(EnvConfiguration.PORT, () => {console.log(`Server listening on port ${EnvConfiguration.PORT}`)});

    }catch(error){
        console.log(error);
    }
}
main();
