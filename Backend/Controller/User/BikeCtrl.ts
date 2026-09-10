import { Request, Response, NextFunction } from "express";
import { Bike } from "../../Model/BikeModel";
import { Booking } from "../../Model/BookingModel";
import { formatVehicle } from "../../utils/formatVehicle";


export const getBikesCtrl = async (req: Request,res: Response,next: NextFunction) => {
  console.log("Bikes Request Received");

  const response = await Bike.find({
        isListed:true
  });

  res.json(response.map(formatVehicle));
};


export const getBikeModelCtrl = async (req: Request,res: Response,next: NextFunction) => {
  console.log("Bike Model Request Received");

  const model = (req.params.model as string).toLowerCase();

  const response = await Bike.findOne({
    model: { $regex: `^${model}$`, $options: "i" },
    isListed:true
  });

  res.json(response ? formatVehicle(response) : response);
};


export const getBikeCtrl = async (req: Request,res: Response,next: NextFunction) => {
  const { vehicleId } = req.params;

  console.log("Bikes Request Received");

  const response = await Bike.findOne({
        _id:vehicleId,
        isListed:true
});

  res.json(response ? formatVehicle(response) : response);
};


export const bikeDateFilter = async (req: Request,res: Response,next: NextFunction) => {

  const { startDate, endDate } = req.body;

  try {

    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);

    const bikeIds = await Booking.distinct("vehicleId", {
      vehicleType: "car",
      bookingStatus: { $in: ["confirmed", "ongoing"] },
      startDate: { $lt: requestedEnd },
      endDate: {
        $gt: new Date(
          requestedStart.getTime() - 8 * 60 * 60 * 1000
        )
      },
      
    });

    const bikes = await Bike.find({
      _id: { $nin: bikeIds },
      isListed:true
    });

    return res.status(200).json(bikes.map(formatVehicle));

  } catch (error) {
    return res.status(500).json(error);
  }
};