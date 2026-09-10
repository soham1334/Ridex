import mongoose from 'mongoose'

const userTokenSchema = new mongoose.Schema ({
    userId :{
        type :mongoose.Schema.Types.ObjectId,
        required:true,
        ref :"User"
        
    },
    refreshToken :{
        type :String,
        required:true
    },
    createdAT :{
        type :Date,
        required :true,
        default :Date.now,
        expires: 7 * 86400
    }
})

export const UserToken = mongoose.model("UserToken",userTokenSchema);