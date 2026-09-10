export const formatVehicle = (vehicle: any) => {
   const vehicleType = vehicle.vehicleType;

  const data = vehicle.toObject ? vehicle.toObject() : vehicle;

 

  if (data.pics?.length > 0) {
    data.images = data.pics.map(
      (pic: Buffer) => `data:image/jpeg;base64,${pic.toString("base64")}`
    );
  }

  delete data.pics;
 data.vehicleType = vehicleType;
  return data;
};

export const formatbooking = (booking: any) => {
   
   

  const data = booking.toObject ? booking.toObject() : booking;

 
 
  if (data.vehicleSnapshot.pics) {
    
    data.vehicleSnapshot.image = `data:image/jpeg;base64,${data.vehicleSnapshot.pics.toString("base64")}`
  
  }

  delete data.vehicleSnapshot.pics;
  
  return data;
};