import { Request, Response, NextFunction } from "express";
import { Car } from "../../Model/CarModel";
import { Booking } from "../../Model/BookingModel";
import { formatVehicle } from "../../utils/formatVehicle";


export const getCarsCtrl = async (req: Request,res: Response,next: NextFunction) => {
  console.log("Cars Request Received");

  const response = await Car.find({isListed:true});

  res.json(response.map(formatVehicle));
};


export const getCarModelCtrl = async (req: Request,res: Response,next: NextFunction) => {
  console.log("Car Model Request Received");

  const model = (req.params.model as string).toLowerCase();

  const response = await Car.findOne({
    model: { $regex: `^${model}$`, $options: "i" },
    isListed:true
  });

  res.json(response ? formatVehicle(response) : response);
};


export const getCarCtrl = async (req: Request,res: Response,next: NextFunction) => {
  const { vehicleId } = req.params;

  console.log("Cars Request Received");

  const response = await Car.findOne({
        _id:vehicleId,
        isListed:true
});

  res.json(response ? formatVehicle(response) : response);
};


export const carsDateFilter = async (req: Request,res: Response,next: NextFunction) => {

  const { startDate, endDate } = req.body;

  try {

    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);

    const carIds = await Booking.distinct("vehicleId", {
      vehicleType: "car",
      bookingStatus: { $in: ["confirmed", "ongoing"] },
      startDate: { $lt: requestedEnd },
      endDate: {
        $gt: new Date(
          requestedStart.getTime() - 24 * 60 * 60 * 1000
        )
      }
    });

    const cars = await Car.find({
      _id: { $nin: carIds }
    });

    return res.status(200).json(cars.map(formatVehicle));

  } catch (error) {
    return res.status(500).json(error);
  }
};