import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    drivingLicense: {
        type: String
    },

    panNumber: {
        type: String
    },
    createdAt :{
        type: Date,
        required :true,
        default: Date.now
    }

});

export const User = mongoose.model("User",userSchema);