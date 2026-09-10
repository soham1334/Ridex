import express from 'express';
import  { Request, Response, NextFunction } from "express";
export const userBikeRouter = express.Router()

import  {getBikesCtrl , getBikeModelCtrl,getBikeCtrl, bikeDateFilter} from "../../Controller/User/BikeCtrl"

userBikeRouter.get("/user/bikes",getBikesCtrl)

userBikeRouter.get("/user/bikes/:model",getBikeModelCtrl)

userBikeRouter.get("/user/bikes/id/:vehicleId",getBikeCtrl)

userBikeRouter.post("/user/bikes/datefilter",bikeDateFilter)


