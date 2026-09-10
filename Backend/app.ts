import 'dotenv/config';
import express from 'express';
import { ConnectDB } from './Config/db';
import  { Request, Response, NextFunction } from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

import {userBikeRouter} from "./Routes/User/bikeRouter"
import {userCarRouter} from "./Routes/User/carsRouter"
import { userAuthRouter } from './Routes/User/authRouter';
import { cartRouter } from './Routes/User/cartRouter';
import {bookingRouter} from './Routes/User/bookingRouter'
import { hostRouter } from './Routes/Host/hostRouter';
import {userProtectedViewCtrl} from './Controller/User/userAuthCtrl'
import { adminRouter } from './Routes/Admin/adminRouters';
import { adminAccessCtrl } from './Controller/Admin/adminvehicleCtrl';

// app.use("/",(req :Request,res :Response,next :NextFunction) =>{
//         console.log("Request Received")
//         res.send("Resquest Successfull")
// })
const app = express();

ConnectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)

app.use(express.json());
app.use(cookieParser());


app.use(userBikeRouter);
app.use(userCarRouter);
app.use(userAuthRouter);

app.use(userProtectedViewCtrl);
app.use(hostRouter);
app.use(cartRouter);
app.use(bookingRouter);
app.use(adminAccessCtrl)
app.use(adminRouter);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
