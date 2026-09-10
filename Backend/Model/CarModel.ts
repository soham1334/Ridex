import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },

    model: {
        type: String,
        required: true,
        index: true
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    vehicleNo:{
        type :String,
        required:true
    },

    images: {
        type: [String],
        required: false
    },

    pics :{
        type:[Buffer],
        required :false

    },

    rent: {
        type: Number,
        required: true,
        min: 0
    },

    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },

    reviews: {
        type: Number,
        required: true,
        min: 0
    },

    fuel: {
        type: String,
        required: true
    },

    transmission: {
        type: String,
        required: true
    },

    seats: {
        type: Number,
        required: true,
        min: 1
    },

    mileage: {
        type: Number,
        required: true,
        min: 0
    },

    age: {
        type: Number,
        required: true,
        min: 0
    },

    distanceCovered: {
        type: Number,
        required: true,
        min: 0
    },

    description: {
        type: String,
        required: true
    },

    isListed :{
        type:Boolean,
        default :true
    }

});

export const Car = mongoose.model("Car", carSchema);