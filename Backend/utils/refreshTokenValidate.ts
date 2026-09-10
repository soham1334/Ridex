import jwt  from "jsonwebtoken";
import { UserToken } from "../Model/UserTokenModel";


export const verifyRefreshToken = async (refreshToken:string) =>{
     
    const private_key = process.env.REFRESH_TOKEN_SECRET!

    const valid = await UserToken.exists({refreshToken})
    if(!valid){
        return {
            error: true, 
            message: "Invalid refresh token" 
        }
    }

    try{
        const response = jwt.verify(refreshToken,private_key);

        return {
            response,
            error: false,
            message: "Valid refresh token"
        }
    }catch(error){
        return {
            error:true,
            message: "Invalid refresh token"
        }
    }

   
}
