import { Request, Response, NextFunction } from "express";
import { Bike } from "../../Model/BikeModel";
import { Booking } from "../../Model/BookingModel";
import { formatVehicle } from "../../utils/formatVehicle";
import { Car } from "../../Model/CarModel";
import { User } from "../../Model/UserModel";



export const getvehiclesCtrl = async (req: Request,res: Response,next: NextFunction) =>{
    try{
        const cars = await Car.find().populate("ownerId","_id name email");
        const bikes =await Bike.find().populate("ownerId","_id name email");

        cars.forEach((car )=>{(car as any).vehicleType = 'car'})
        bikes.forEach((bike)=>{(bike as any).vehicleType = 'bike'})

        const vehi = [...cars,...bikes]
        const vehicles = vehi.map(formatVehicle)
       

        return res.status(200).json(vehicles)
    }catch(error){
        return res.status(500).json(error)
    }
}

export const editvehicleCtrl =  async (req: Request,res: Response,next: NextFunction) =>{
    console.log("Admin Edit Request Received")
    const {vehicleId} = req.params
    const {vehicleType,...data} = req.body
    
    
    try{
        const files = req.files as Express.Multer.File[]

        if(files && files.length >0){
            data.pics = files.map((file)=>file.buffer);
        }

        const response = vehicleType === 'car'
        ? await Car.findByIdAndUpdate(vehicleId,{...data})
        :await Bike.findByIdAndUpdate(vehicleId,{...data})

        return res.status(200).json({
            message :"vehicle updated successfully"
        })
    }catch(error){
        return res.status(500).json(error)
    }
}

export const adminAccessCtrl =  async (req: Request,res: Response,next: NextFunction) =>{
    const user = req.user
    try{
        if(!user){
            return res.status(401).json({
                 message: "Authentication required"
            })
        }
        
        if(user?.role !== 'admin'){
            return res.status(403).json({
                message: "Admin access required"
            })
        }
    }catch(error){
        return res.status(500).json(error)
    }
    next()
}