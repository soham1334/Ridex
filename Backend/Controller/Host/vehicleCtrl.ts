import { Request, Response, NextFunction } from "express";
import { Bike } from "../../Model/BikeModel";
import { Booking } from "../../Model/BookingModel";
import { formatVehicle } from "../../utils/formatVehicle";
import { Car } from "../../Model/CarModel";
import { User } from "../../Model/UserModel";
import bcrypt from 'bcrypt'
import mongoose from "mongoose";




export const vehicleAddCtrl = async (req: Request,res: Response,next: NextFunction) =>{
      try {
        const vehicle = req.body;
        const ownerId = req.user?._id
        vehicle.rating = Number((Math.random() * 1.5 + 3.5).toFixed(1)) 
        vehicle.reviews = Math.floor(Math.random() * 981) + 20
        vehicle.ownerId = ownerId
        const files = req.files as Express.Multer.File[];

              if (files && files.length > 0) {
                vehicle.pics = files.map(
                  (file) => file.buffer
                );
              }
        
        const response = vehicle.vehicleType === 'car'?
        await Car.exists({ownerId:ownerId,vehicleNo:vehicle.vehicleNo}) 
        :await Bike.exists({ownerId:ownerId,vehicleNo:vehicle.vehicleNo})
        if(response){
            return res.status(409).json({
                message :"Vehicle is already Listed"
            })
        }
        const addvehicle = vehicle.vehicleType === 'car'?await Car.create(vehicle) :await Bike.create(vehicle)
         
        return res.status(201).json({
            message :"Vehicle added successfully"
        })
      }catch(error){
        return res.status(500).json(error)
      }
}

export const getListedVehiclesCtrl = async (req: Request,res: Response,next: NextFunction) =>{
try {
    const strownerId = req.user?._id;
   
    
    console.log("fetch vehicle request received")

    if (!strownerId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }
     const ownerId = new mongoose.Types.ObjectId(strownerId);

    const [cars, bikes] = await Promise.all([

      // ---------------- CARS ----------------
      Car.aggregate([
        {
          $match: { ownerId: ownerId}
        },

        {
          $lookup: {
            from: "bookings",

            let: {vehicleId: "$_id"},

            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [  "$vehicleId",  "$$vehicleId"]
                  },

                  vehicleType: "car",
                  payoutStatus: {$in:["paid","pending"]}
                }
              },

              {
                $group: {  _id: null,

                  totalEarnings: {  $sum: "$ownerEarning"},

                  bookings: {  $sum: 1}
                }
              }
            ],

            as: "bookingStats"
          }
        },

        {
          $addFields: {
            totalEarnings: {
              $ifNull: [
                {
                  $arrayElemAt: [ "$bookingStats.totalEarnings",  0]
                },
                0
              ]
            },

            bookings: {
              $ifNull: [
                {
                  $arrayElemAt: [  "$bookingStats.bookings",  0]
                },
                0
              ]
            }
          }
        },

        {
          $project: {  bookingStats: 0}
        }
      ]),

     
      // ---------------- BIKES ----------------
      Bike.aggregate([
        {
          $match: {  ownerId: ownerId}
        },

        {
          $lookup: {
            from: "bookings",

            let: {  vehicleId: "$_id"},

            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [  "$vehicleId",  "$$vehicleId"]
                  },

                  vehicleType: "bike",
                  payoutStatus: {$in:["paid","pending"]}
                }
              },

              {
                $group: {
                  _id: null,

                  totalEarnings: {  $sum: "$ownerEarning"},

                  bookings: {  $sum: 1}
                }
              }
            ],

            as: "bookingStats"
          }
        },

        {
          $addFields: {
            totalEarnings: {
              $ifNull: [
                {
                  $arrayElemAt: [  "$bookingStats.totalEarnings",  0]
                },
                0
              ]
            },

            bookings: {
              $ifNull: [
                {
                  $arrayElemAt: [  "$bookingStats.bookings",  0]
                },
                0
              ]
            }
          }
        },

        {
          $project: {  bookingStats: 0}
        }
      ])

    ]);
    
    cars.forEach((car)=>{car.vehicleType = 'car'})
    bikes.forEach((bike)=>{bike.vehicleType = 'bike'})
  

    console.log("Car,bike db fetch completed")

         const vehicles = [...cars,...bikes].map(formatVehicle);

      
        return res.status(200).json(vehicles)
    }catch(error){
        return res.status(500).json(error)
    }
}

export const un_listvehiclesCtrl = async (req: Request,res: Response,next: NextFunction) =>{
  console.log("unlist request received")
    const userId = req.user?._id
    const {vechicleId} = req.params
    const {email,password,vehicleType} = req.body

    
    try{
        const user = await User.findOne({_id:userId,email})
        if(!user){
            return res.status(401).json({
                message :"email doesnt exists"
            })
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if(!valid){
            return res.status(401).json({
                 message: "Invalid password"
            })
        }

        const vehicle = vehicleType === 'car'?
        await Car.findById(vechicleId)
        :await Bike.findById(vechicleId)

        

        if(!vehicle){
           return res.status(404).json({
            message:"vehicle not found"
           })
        }

        vehicle.isListed = !vehicle.isListed;
        vehicle.save()

        return res.status(200).json({
            message:"Vehcile listed status updated"
        })

    }catch(error){
        return res.status(500).json(error)
    }
}

export const deleteVehicleCtrl = async (req: Request,res: Response,next: NextFunction) =>{
   console.log("Delete vehicle Request Received")

    const userId = req.user?._id
    
    const {vehicleId} = req.params
   
    const {email,password,vehicleType} = req.body
    

    try{
        const booking = await Booking.find({
          ownerId:userId,
          vehicleId,
           bookingStatus:"confirmed"
          })
          

          if(booking.length>0){
           
            const response = vehicleType === "car"?
            await Car.findByIdAndUpdate(vehicleId,
              {$set :{isListed :false}})
            : await Bike.findByIdAndUpdate(vehicleId,
              {$set :{isListed:false}}
            ) 
            
            return res.status(408).json({
              message :"vehicle is booked by someone"
            })
          }


        const user = await User.findOne({_id:userId,email})
        if(!user){
            return res.status(401).json({
                message :"email doesnt exists"
            })
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if(!valid){
            return res.status(401).json({
                 message: "Invalid password"
            })
        }

        const vehicle = vehicleType === 'car'?
        await Car.findByIdAndDelete(vehicleId)
        :await Bike.findByIdAndDelete(vehicleId)

        
        return res.status(200).json({
            message:"Vehcile deleted successfully"
        })

    }catch(error){
        return res.status(500).json(error)
    }
}


export const editVehicleCtrl = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const { vehicleId } = req.params;
    const { vehicleType, ...updates } = req.body;

    const ownerId = req.user?._id;

    if (vehicleType !== "car" && vehicleType !== "bike") {
      return res.status(400).json({
        message: "Invalid vehicle type"
      });
    }

    // Make sure this vehicle belongs to the logged-in owner
    const vehicle = vehicleType === "car"
      ? await Car.findOne({
          _id: vehicleId,
          ownerId: ownerId
        })
      : await Bike.findOne({
          _id: vehicleId,
          ownerId: ownerId
        });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    // Company and model should not be editable
delete updates.company;
delete updates.model;
delete updates.vehicleNo;

    
    if (updates.vehicleNo) {
      const duplicate = vehicleType === "car"
        ? await Car.exists({
            ownerId: ownerId,
            vehicleNo: updates.vehicleNo,
            _id: { $ne: vehicleId }
          })
        : await Bike.exists({
            ownerId: ownerId,
            vehicleNo: updates.vehicleNo,
            _id: { $ne: vehicleId }
          });

      if (duplicate) {
        return res.status(409).json({
          message: "Vehicle with this number is already listed"
        });
      }
    }

    const updatedVehicle = vehicleType === "car"
      ? await Car.findOneAndUpdate(
          {
            _id: vehicleId,
            ownerId: ownerId
          },
          {
            $set: updates
          },
          {
            new: true,
            runValidators: true
          }
        )
      : await Bike.findOneAndUpdate(
          {
            _id: vehicleId,
            ownerId: ownerId
          },
          {
            $set: updates
          },
          {
            new: true,
            runValidators: true
          }
        );

    return res.status(200).json({
      message: "Vehicle updated successfully",
    });

  } catch (error) {
    console.error("EDIT VEHICLE ERROR:", error);

    return res.status(500).json({
      message: "Failed to update vehicle",
      error
    });
  }
};

