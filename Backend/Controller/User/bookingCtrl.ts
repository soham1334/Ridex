import  { Request, Response, NextFunction } from "express";

import {Booking,IBookingRequest} from "../../Model/BookingModel"
import { Car } from "../../Model/CarModel";
import {Bike} from "../../Model/BikeModel"
import { Cart } from "../../Model/CartModel";
import { formatbooking } from "../../utils/formatVehicle";

export const bookingCtrl = async (req :Request,res :Response,next :NextFunction) =>{
    console.log("Booking Request Received")
     const userId  = req.user?._id;
    
    const bookings :IBookingRequest= req.body
    
    const generateBookingCode = () => {
    const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

    const random = Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase();

    return `RX-${date}-${random}`;
      };

    const bookingcode  = generateBookingCode();  
   
    try{
        if(bookings.vehicles.length>1){
            console.log("cancel id",userId)
           const response =  await Cart.findOneAndDelete({userId})
           console.log("CART CLEARANCE :",response)

        }
        for(let book of bookings.vehicles){
            
            let vehicle = book.vehicleType === "car"
             ? await Car.findOne({_id:book.vehicleId,isListed:true}) 
             :await Bike.findOne({_id:book.vehicleId,isListed:true})

             if(!vehicle){ 
                return res.status(404).json({
                          message: "Vehicle not found"
                            });
             }


            const valid = await Booking.findOne({
                          vehicleId: vehicle._id,
                          bookingStatus: "confirmed",
                          startDate: { $lt: new Date(book.endDate) },
                           endDate: { $gt: new Date(book.startDate) }
                        });

                     
            if(valid){
                return res.status(409).json({
                   message: "Vehicle is already booked for these dates"
                 });
            }

            const duration = (new Date(book.endDate).getTime() -new Date(book.startDate).getTime()) /(1000 * 60 * 60);

            if (duration <= 0) {
                return res.status(400).json({
                    message: "End date must be after start date"
                });
            }

            const billableHours = duration < 20 ? duration: Math.floor(duration/ 24) * 20 +(duration % 24 <20?duration % 24:20);

            


            const doc = {
                bookingCode:bookingcode,
                renterId :userId ,
                ownerId :vehicle.ownerId,
                vehicleId:vehicle._id ,
                vehicleType:book.vehicleType,
                vehicleSnapshot: {
                    company :vehicle.company,
                    model :String(vehicle.model),
                    image: vehicle.images?.[0],
                    pics: vehicle.pics?.[0],
                    vehicleNo :vehicle.vehicleNo
                },
                startDate:book.startDate,
                endDate :book.endDate,
                durationHours : duration ,
                rentalAmount: vehicle.rent *  billableHours  ,
                platformFee :99,
                ownerEarning: 0.8* billableHours *vehicle.rent,
                totalAmount: billableHours *vehicle.rent + 99,
                bookingStatus:"confirmed" as const,
                paymentMethod: bookings.paymentMethod,
                paymentStatus:  bookings.paymentMethod === "online"?"paid" as const:"pending" as const,
                pickupLocation: bookings.pickupLocation,
                dropoffLocation: bookings.dropoffLocation,
                drivingLicenseNumber:bookings.drivingLicense,
                specialRequest:bookings.specialRequest,
                

            }
            

            const doBooking = await Booking.create(doc)


        }

        return res.status(201).json({
            message :"Booking Confirmed"
        })

    }catch(error){
        console.error("BOOKING ERROR:", error)

    return res.status(500).json({
        message: "Booking failed",
        error: error
    })
    }

}


export const dateValidateCtrl = async (req :Request,res :Response,next :NextFunction) =>{
    const userId = req.user?._id
    const {vehicleId} = req.params
    const {vehicleType ,startDate, endDate} = req.body

    console.log(vehicleId,vehicleType)

    try{
        const vehicle = vehicleType === "car" 
        ? await Car.exists({_id:vehicleId,isListed:true}) : await Bike.exists({_id: vehicleId,isListed:true})

        if(!vehicle){
            return res.status(404).json({
                message :"vehicle not found"
            })
        }

        const valid = await Booking.findOne({
                          vehicleId,
                          bookingStatus: "confirmed",
                          startDate: { $lt: new Date(endDate) },
                           endDate: { $gt: new Date(startDate) }
                        });
        
        if(valid){
            return res.status(409).json({
                   message: "Vehicle is already booked for these dates"
                 });
        } 
        
        return res.status(200).json({
                    message: "Vehicle is available"
                })


    }catch(error){
        res.status(500).json(error)
    }

}

export const mybookingsCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { status } = req.params
    const userId = req.user?._id

    try {

        const now = new Date()

        if (status === "all") {

            const bookings = await Booking.find({
                renterId: userId
            })
            
            const f_bookings = bookings.map(formatbooking)

            return res.status(200).json(f_bookings)
        }

        else if (status === "upcoming") {

            const bookings = await Booking.find({
                renterId: userId,
                bookingStatus: "confirmed",
                startDate: { $gt: now }
            })
             const f_bookings = bookings.map(formatbooking)
            return res.status(200).json(f_bookings)
        }

        else if (status === "completed") {

            await Booking.updateMany(
                {
                    renterId: userId,
                    bookingStatus: "confirmed",
                    endDate: { $lt: now }
                },
                {
                    $set: {
                        bookingStatus: "completed",
                        payoutStatus:"paid"
                    }
                }
            )

            const bookings = await Booking.find({
                renterId: userId,
                bookingStatus: "completed"
            })
             const f_bookings = bookings.map(formatbooking)
            return res.status(200).json(f_bookings)
        }

        else if (status === "cancelled") {

            const bookings = await Booking.find({
                renterId: userId,
                bookingStatus: "cancelled"
            })
            console.log(bookings)
             const f_bookings = bookings.map(formatbooking)

             console.log(f_bookings)
            return res.status(200).json(f_bookings)
        }

        return res.status(400).json({
            message: "Invalid booking status"
        })

    } catch (error) {

        return res.status(500).json(error)
    }
}

export const mybookingsCancelCtrl = async (req :Request,res :Response,next :NextFunction) => {
     const{bookingId} = req.params
      const userId = req.user?._id
       
      const twoDaysFromNow = new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
        )
       
     try{
        const booking = await Booking.findOne({
            _id :bookingId,
            renterId: userId,
            bookingStatus :"confirmed",
            startDate : {$gt : twoDaysFromNow}
        })

        
            if (!booking) {
                return res.status(404).json({
                    message: "Booking not found or cannot be cancelled"
                })
            }
        
        booking.bookingStatus = "cancelled"
        booking.cancellationReason = "Cancelled by renter"
        booking.cancelledAt = new Date()
        booking.cancelledBy = "renter"

         await booking.save()

        return res.status(200).json({
                message: "Booking cancelled successfully",
                booking
             })


     }catch(error){
        return res.status(500).json(error)
     }   

}