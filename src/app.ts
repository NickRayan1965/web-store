import express, { Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import EnvConfiguration from './config/app.config';
import authRouter from './routes/auth.route';
import morgan from 'morgan';



const app = express();
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (req: Request, res: Response) => {
    res.json('hola mundo');
});
app.use('/auth', authRouter);
export default app;
