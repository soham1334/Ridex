import express from 'express'
import { cartAddCtrl,cartDelCtrl,cartVehiclesCtrl,cartDateChangeCtrl } from '../../Controller/User/cartCtrl';


export const cartRouter = express.Router();



cartRouter.post("/user/cart/add",cartAddCtrl); 

cartRouter.delete("/user/cart/:vehicleId", cartDelCtrl);

cartRouter.get("/user/cart/vehicles",cartVehiclesCtrl);

cartRouter.patch("/user/cart/dateChange/:vehicleId",cartDateChangeCtrl);