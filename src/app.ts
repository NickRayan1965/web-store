import express, { Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import './config/app.config';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import productRoute from './routes/product.route';



const app = express();
//app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (req: Request, res: Response) => {
    res.json('hola mundo');
});
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/product', productRoute);
export default app;
