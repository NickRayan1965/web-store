import express, { Request, Response} from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route';
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (req: Request, res: Response) => {
    res.json('hola mundo');
});
app.use('/auth', authRouter);
export default app;
