
import {SignIn,SignUp,ResetPassword,ForgotPassword,Validateopt,Logout,test, getAllusers} from '../controller/userController.js';
import express from 'express';
import { signUpValidation,signInValidation,otpValidation,resetPasswordValidation,forgotpasswordValidation, } from '../utils/validation.js';
const route= express.Router();
route.get("/Test",test)
route.post('/signup',signUpValidation,SignUp)
route.post('/signin',signInValidation,SignIn)
route.get('/listAll',getAllusers)
route.post('/resetpassword',resetPasswordValidation,ResetPassword)
route.post('/forgotpassword',forgotpasswordValidation,ForgotPassword)
route.post('/verify',otpValidation,Validateopt)

export default route;
