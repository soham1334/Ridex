import express from 'express'
import multer from 'multer'


import { editvehicleCtrl, getvehiclesCtrl } from '../../Controller/Admin/adminvehicleCtrl';
const upload = multer({ storage: multer.memoryStorage() });

export const adminRouter = express.Router();

adminRouter.get('/api/admin/vehicles',getvehiclesCtrl);

adminRouter.patch('/api/admin/vehicles/edit/:vehicleId',upload.array("pics"),editvehicleCtrl)