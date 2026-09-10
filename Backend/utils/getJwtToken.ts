import jwt from "jsonwebtoken";
import { Request, Response } from "express";    
import { UserToken } from "../Model/UserTokenModel";


export const generateJwtTokens = async (user: any) =>{
    const payload = {_id:user._id ,name :user.name, email:user.email, role:user.role}

    const accessToken = jwt.sign (
        payload ,
        process.env.ACCESS_TOKEN_SECRET !,
        { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET !,
         { expiresIn: "7d" }
    );
     
    const userToken = await UserToken.findOneAndDelete({userId :user._id})

    const newUserToken = await UserToken.create({
        userId :user._id,
        refreshToken
    })

    return {accessToken, refreshToken }
    



}