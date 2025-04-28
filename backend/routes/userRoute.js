import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getProfile,
  resetPassword,
  changePassword,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

userRouter.post("/myprofile", authUser, getProfile);

//Forgot password
userRouter.post("/resetpassword", resetPassword);

userRouter.post("/changepassword", authUser, changePassword);

export default userRouter;
