import 'express-async-errors';
import * as dotenv from 'dotenv'; //env
import express from 'express';
import morgan from 'morgan'; //logs
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import serviceRouter from './Router/ServiceRouter.js';
import authRoute from './Router/AuthRoute.js';
import userRouter from './Router/userRoute.js';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

//get .env values best practice
dotenv.config();

//server
const app = express();

//in dev environment morgan works
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/bikeapi/v1/auth', authRoute);
app.use('/bikeapi/v1/service', authenticateUser, serviceRouter);
app.use('/bikeapi/v1/users', authenticateUser, userRouter);
app.get('/bikeapi/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});
// if none of the above route mathch
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found and none of the route mathch  ' });
});

//any resource is not avilable on the server express get the error response from the server methods and returns back the erro response
app.use(errorHandlerMiddleware);

//server to port
const port = process.env.PORT || 5100;
try {
  await mongoose.connect(process.env.MONGO_URL);
  // console.log('DBurl ok connecting to db>>>>>');
  app.listen(port, () => console.log(`server connected to ${port}...`));
} catch (error) {
  console.log('server to DB connection error>>>>>>>>>>>>>', error);
  process.exit(1);
}
