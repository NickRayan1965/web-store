import express, { Request, Response} from 'express';
const cors = require('cors');
import dotenv from 'dotenv';
dotenv.config();
import './config/app.config';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import productRouter from './routes/product.route';
import brandRouter from './routes/brand.route';
import categoryRouter from './routes/category.route';



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (req: Request, res: Response) => {
    res.json('hola mundo');
});
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/product', productRouter);
app.use("/brand", brandRouter);
app.use("/category", categoryRouter);
export default app;
