import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    items: [
        {
            vehicleId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                index:true
            },

            vehicleType: {
                type: String,
                enum: ["car", "bike"],
                required: true
            },

            startDate: {
                type: Date,
                required: true
            },

            endDate: {
                type: Date,
                required: true
            }
        }
    ]
});

export const Cart = mongoose.model("Cart", cartSchema);