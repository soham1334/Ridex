import express from "express"
import { userSignupCtrl ,userLoginCtrl,userRefreshCtrl,userLogoutCtrl,  deleteUserCtrl,getUserCtrl,userProtectedViewCtrl} from "../../Controller/User/userAuthCtrl";

export const userAuthRouter = express.Router();

userAuthRouter.post("/api/user/auth/signup",userSignupCtrl);

userAuthRouter.post("/api/user/auth/login",userLoginCtrl);

userAuthRouter.post("/api/user/auth/refresh",userRefreshCtrl);

userAuthRouter.post("/api/user/auth/logout",userLogoutCtrl);

userAuthRouter.get("/api/user/acc/info",userProtectedViewCtrl,getUserCtrl);

userAuthRouter.patch("/api/user/acc/delete",userProtectedViewCtrl,deleteUserCtrl);


