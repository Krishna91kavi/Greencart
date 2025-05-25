import cookieParser from 'cookie-parser';
import express, { response } from 'express';
import cors from 'cors';
import connectDB from './configs/Db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/Cloudinary.js';
import productRouter from './routes/ProductRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/AddressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

 const app = express();

 const port = process.env.PORT || 4000;
    await connectDB()
    await connectCloudinary()

 //Allow multipl origins
// const  allowedOrigins = ['http://localhost:5173']
const allowedOrigins = ['http://localhost:5173', 'http://192.168.0.123:5173'];

app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)

 //Middleware Configuration
 app.use(express.json()); 
 app.use(cookieParser());
 app.use(cors({origin:allowedOrigins , credentials:true}));


 app.get('/',(req,res) => res.send("API is Working "))
 app.use('/api/user', userRouter);
 app.use('/api/seller', sellerRouter);
 app.use('/api/product',productRouter);
 app.use('/api/cart',cartRouter);
 app.use('/api/address',addressRouter);
 app.use('/api/order',orderRouter);

 app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
 })