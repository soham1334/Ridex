import { Request, Response, NextFunction } from "express";
import { Cart } from "../../Model/CartModel";
import {Bike} from "../../Model/BikeModel"
import {Car} from "../../Model/CarModel"
import { Booking } from "../../Model/BookingModel";
import {formatVehicle} from "../../utils/formatVehicle"

export const cartAddCtrl = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Cart Request Received");
     const userId = req.user?._id
    const {vehicleId,vehicleType,startDate,endDate } = req.body;

    try {
        const userCart = await Cart.findOne({ userId });

        if (!userCart) {

            await Cart.create({
                userId,
                items: [{vehicleId,vehicleType,startDate,endDate}]
            });

            return res.status(201).json({
                message: "Vehicle Added to Cart"
            });
        }

        const dupvehicle = userCart.items.some((item) =>
            item.vehicleId.toString() === vehicleId.toString() &&
            item.vehicleType === vehicleType
        );

        if (!dupvehicle) {

            userCart.items.push({vehicleId,vehicleType,startDate,endDate});

            await userCart.save();

            return res.status(201).json({
                message: "Vehicle Added to Cart"
            });
        }

        return res.status(409).json({
            message: "Vehicle already in cart"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const cartDelCtrl = async (req: Request, res: Response, next: NextFunction) =>{
     const { vehicleId} = req.params
    
     const userId  = req.user?._id
     
     try{
        const user = await Cart.findOne({userId});
         user?.items.pull({vehicleId})
         await user?.save()

         return res.status(201).json({
            message :"vechicle removed successfully"
         })
     }catch(error){
        return res.status(500).json({
            message: "Internal server error"
        });
     }
}

export const cartVehiclesCtrl = async ( req: Request,res: Response,next: NextFunction) => {
  console.log("entered into cart vechicles ctrl")
  const userId = req.user?._id
 

  try {
    const userCart = await Cart.findOne({ userId })

    if (!userCart) {
      return res.status(404).json({
        message: "No Vehicles are added in cart"
      })
    }

    const carIds = userCart.items
      .filter(item => item.vehicleType === "car")
      .map(item => item.vehicleId)

    const bikeIds = userCart.items
      .filter(item => item.vehicleType === "bike")
      .map(item => item.vehicleId)

    const [b_cars,b_bikes] = await Promise.all([
      Car.find({ _id: { $in: carIds } }),
      Bike.find({ _id: { $in: bikeIds } })
    ])
     const cars = b_cars.map(formatVehicle)
     const bikes = b_bikes.map(formatVehicle)

    const carMap = new Map(
      cars.map(car => [car._id.toString(), car])
    )

    const bikeMap = new Map(
      bikes.map(bike => [bike._id.toString(), bike])
    )

    const vehicles = userCart.items.map(item => {
      const vehicle =
        item.vehicleType === "car"
          ? carMap.get(item.vehicleId.toString())
          : bikeMap.get(item.vehicleId.toString())

      return {
       vehicle,
        vehicleType : item.vehicleType,
        startDate: item.startDate,
        endDate: item.endDate
      }
    })


    return res.status(200).json(vehicles)

  } catch (error) {
    next(error)
  }
}

export const cartDateChangeCtrl = async ( req: Request,res: Response,next: NextFunction) =>{
    const {vehicleId} = req.params
    const {startDate ,endDate} = req.body
    const userId = req.user?._id

    try{
        const valid = await Booking.findOne({
                                  vehicleId: vehicleId,
                                  bookingStatus: "confirmed",
                                  startDate: { $lt: new Date(endDate) },
                                   endDate: { $gt: new Date(startDate) }
                                });
        
        if(valid){
          return res.status(409).json({
                   message: "Vehicle is already booked for these dates"
                 })
        }                        
        
        const user = await Cart.updateOne(
            {
            userId,
            "items.vehicleId": vehicleId
            },
            {
               $set: {
                  "items.$.startDate":startDate,
                  "items.$.endDate": endDate
                }
            }
        )
        

        return res.status(200).json({
            message :"Date Changed Successfully"
        })


    }catch(error){
        return res.status(500).json({
           message: "Internal server error"
        })
    }
}