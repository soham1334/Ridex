import express from 'express';
import  { Request, Response, NextFunction } from "express";
export const userCarRouter = express.Router()

import {getCarsCtrl , getCarModelCtrl, getCarCtrl, carsDateFilter} from "../../Controller/User/carCtrl"

userCarRouter.get("/user/cars/",getCarsCtrl)

userCarRouter.get("/user/cars/:model",getCarModelCtrl)

userCarRouter.get("/user/cars/id/:vehicleId",getCarCtrl)

userCarRouter.post("/user/cars/datefilter",carsDateFilter)

