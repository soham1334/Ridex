import mongoose from "mongoose"





export interface IBookingRequest {
    vehicles: {
        vehicleId: mongoose.Types.ObjectId;
        vehicleType: "car" | "bike";
        startDate: Date;
        endDate: Date;
    }[];

    pickupLocation: string;
    dropoffLocation: string;
    drivingLicense: string;
    specialRequest?: string;
    paymentMethod: "online" | "pay_at_pickup";
}

const bookingSchema = new mongoose.Schema(
  {
    // =========================
    // BOOKING IDENTIFICATION
    // =========================

    bookingCode: {
      type: String,
      required: true,
      
    },

    // =========================
    // USERS
    // =========================

    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =========================
    // VEHICLE
    // =========================

    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    vehicleType: {
      type: String,
      enum: ["car", "bike"],
      required: true,
    },

    vehicleSnapshot: {
      company: {
        type: String,
        required: true,
      },

      model: {
        type: String,
        required: true,
      },

      image: {
        type: String,
        
      },
      pics:{
        type:Buffer
  
      },

      vehicleNo :{
        type :String,
        require:true
      }

    },

    // =========================
    // RENTAL PERIOD
    // =========================

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    durationHours: {
      type: Number,
      required: true,
      min: 1,
    },

    // =========================
    // PRICING
    // =========================

    rentalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    platformFee: {
      type: Number,
      required: true,
      min: 0,
    },

    ownerEarning: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // =========================
    // BOOKING STATUS
    // =========================

    bookingStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "ongoing",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    // =========================
    // PAYMENT
    // =========================

    paymentMethod: {
      type: String,
      enum: ["online", "pay_at_pickup"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    // =========================
    // OWNER PAYOUT
    // =========================

    payoutStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
      ],
      default: "pending",
      index: true,
    },

    // payoutId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Payout",
    // },

    // =========================
    // LOCATIONS
    // =========================

    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },

    dropoffLocation: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // RENTER INFORMATION
    // =========================

    drivingLicenseNumber: {
      type: String,
      required: true,
      trim: true,
    },

    specialRequest: {
      type: String,
      trim: true,
    },

    // =========================
    // CART GROUP
    // =========================

    bookingGroupId: {
      type:mongoose.Schema.Types.ObjectId,
      index: true,
    },

    // =========================
    // CANCELLATION
    // =========================

    cancellationReason: {
      type: String,
      trim: true,
    },

    cancelledAt: {
      type: Date,
    },

    cancelledBy: {
      type: String,
      enum: ["renter", "owner", "admin"],
    },

    // =========================
    // IMPORTANT DATES
    // =========================

    confirmedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    payoutPaidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model("Booking",bookingSchema )