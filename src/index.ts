import app from './app';
import {AppDataSource} from './database/db';
import { User } from './entities';
async function main(){
    try{
        await AppDataSource.initialize();
        console.log("Database connected")
        app.listen(process.env.PORT, () => {console.log(`Server listening on port ${process.env.PORT}`);})

    }catch(error){
        console.log(error)
    }
}
main();
