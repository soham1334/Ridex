import express from 'express'
import multer from 'multer'
import { vehicleAddCtrl,getListedVehiclesCtrl ,deleteVehicleCtrl,editVehicleCtrl,un_listvehiclesCtrl} from '../../Controller/Host/vehicleCtrl';

export const hostRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

hostRouter.post("/api/host/addvehicle",upload.array("pics", 5),vehicleAddCtrl);

hostRouter.get("/api/host/listedvehicles",getListedVehiclesCtrl);

hostRouter.patch("/api/host/deletevehicle/:vehicleId",deleteVehicleCtrl);

hostRouter.patch("/api/host/editvehicle/:vehicleId",editVehicleCtrl);

hostRouter.patch("/api/host/un_list/:vechicleId",un_listvehiclesCtrl);

