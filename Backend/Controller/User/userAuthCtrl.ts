/// <reference path="../../types/express.d.ts" />

import  { Request, Response, NextFunction } from "express";
import { User } from "../../Model/UserModel";
import bcrypt from "bcrypt";
import { generateJwtTokens } from "../../utils/getJwtToken";
import { verifyRefreshToken } from "../../utils/refreshTokenValidate";
import jwt from "jsonwebtoken";
import { UserToken } from "../../Model/UserTokenModel";
import { JwtPayload } from "jsonwebtoken";
import { Car } from "../../Model/CarModel";
import { Bike } from "../../Model/BikeModel";
import { Booking } from "../../Model/BookingModel";


export const getUserCtrl = async(req :Request,res :Response,next :NextFunction) => {
    const userId = req.user?._id
    console.log("User info request received")
    try{
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({
                message :'user not found'
            })
        }

        

        return res.status(200).json(user)

        
    }catch(error){
        return res.status(500).json(error)
    }
}

export const deleteUserCtrl = async(req :Request,res :Response,next :NextFunction) =>{
    const userId = req.user?._id
    const {email,password} = req.body

    try{

        const bookings = await Booking.find({ownerId:userId,
            
            bookingStatus:"confirmed"
        })
        if(bookings.length>0){
            return res.status(408).json({
                message :"Your vehicles are booked"
            })
        }
        const user = await User.findOne({
            _id :userId,
            email,
        })
        if(!user){
            return res.status(404).json({
                message :"email not found"
            })
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if(!valid){
            return res.status(401).json({
                message :"Invalid password"
            })
        }


        const response  = await User.findByIdAndDelete(userId)
        await UserToken.findByIdAndDelete(userId)

        await Car.deleteMany({ownerId:userId})
        await Bike.deleteMany({ownerId:userId})

        return res.status(200).json({
            message :"user deleted successfully"
        })
    }catch(error){
        return res.status(500).json(error)
    }
}

export const userSignupCtrl = async(req :Request,res :Response,next :NextFunction) =>{
   
    try{
        
        const {name, email, phone, password} = req.body;

        const dupUser = await User.exists({email});
        
        if(dupUser){
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({name,email,passwordHash,phone})

        return res.status(201).json( {
            message: "User created successfully",
            userId: user._id
        })
    }catch(error){
        res.status(500).json({error});
    }
}
export const userLoginCtrl = async(req :Request,res :Response,next :NextFunction) =>{
       
    try{
        const {email , password} = req.body

        const user = await User.findOne({email}) ;
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
      
        const valid = await bcrypt.compare(password, user.passwordHash);
        if(!valid){
            return res.status(401).json({
                 message: "Invalid password"
            })
        }

        const {accessToken, refreshToken} = await  generateJwtTokens(user);

        res.cookie("refreshToken",refreshToken,{
            httpOnly :true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path : "/api/user/auth/",
            maxAge :7*24*60*60*1000
        })

        res.cookie("accessToken",accessToken,{
            httpOnly :true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path : "/",
            maxAge :10*60*1000
        })

        return res.status(200).json({ 
               message: "Login Successful",
                user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role:user.role
                    }
            })
    }catch(error:any){

        return res.status(500).json(error)
    }

}  

export const userRefreshCtrl = async (req :Request,res :Response,next :NextFunction) =>{
    try{
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({
                message:"refreshToken is missing"
            })
        }

        const {response,error,message} = await verifyRefreshToken(refreshToken)

        if(error){
            return res.status(401).json({
                message
            });
        }

        const private_key = process.env.ACCESS_TOKEN_SECRET!

        const { exp, iat, ...payload } = response as JwtPayload

        const newAccessToken =  jwt.sign(
            payload,
            private_key,
            { expiresIn: "10m" }
        )

        res.cookie("accessToken",newAccessToken,{
            httpOnly :true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path : "/",
            maxAge :10*60*1000
        })

        return res.status(200).json({
            message :"accessToken refreshed successfully"
        })



    } catch(error){
    console.error("REFRESH ERROR:", error);

    return res.status(500).json({
        message: "Refresh token error",
        error: error instanceof Error
            ? error.message
            : error
    });
}
}

export const  userLogoutCtrl = async (req :Request,res :Response,next :NextFunction) =>{
    console.log("logout request received")
    try {
        const refreshToken = req.cookies.refreshToken
       
        if (refreshToken) {
            await UserToken.findOneAndDelete({
                refreshToken
            })
        }
        console.log("token deleted successfully")

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/api/user/auth/"
        })

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        })

        return res.status(200).json({
            message: "Logout successful"
        })

    } catch (error: any) {
        return res.status(500).json(error)
    }
}

export const userProtectedViewCtrl = async (req :Request,res :Response,next :NextFunction) =>{

//        console.log("PROTECTED MIDDLEWARE:", req.method, req.originalUrl);
//   console.log("COOKIES:", req.cookies);
//        console.log("req.cookies",req.cookies)
    try{
        const accessToken = req.cookies.accessToken
        
        if(!accessToken){
             return res.status(401).json({
                 message: "Unauthorized"
              })
        }

            
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET!
        )as JwtPayload & { _id: string };

        req.user  = decoded

        next()

    } catch {
        return res.status(401).json({
            message: "Invalid access token"
        })
    }
    
}
