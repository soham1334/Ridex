import express from 'express'

import { bookingCtrl,dateValidateCtrl,mybookingsCtrl ,mybookingsCancelCtrl} from '../../Controller/User/bookingCtrl';

export const bookingRouter = express.Router()

bookingRouter.post("/user/booking",bookingCtrl);

bookingRouter.post("/user/datevalidate/:vehicleId",dateValidateCtrl);

bookingRouter.get("/user/mybookings/:status",mybookingsCtrl);

bookingRouter.patch("/user/mybookings/cancel/:bookingId",mybookingsCancelCtrl);