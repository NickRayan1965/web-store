import app from './app';
import {AppDataSource} from './database/db';
async function main(){
    await AppDataSource.initialize();
    app.listen(process.env.PORT, () => {console.log(`Server listening on port ${process.env.PORT}`);})
}
main();
