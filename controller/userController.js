import UserModel from "../Model/userModel.js";
import asyncWrapper from "../Middleware/async.js";
import { otpGenerator } from "../Utils/otp.js";
import {BadRequestError,UnauthorizedError} from "../Error/index.js";
import {validationResult} from 'express-validator';
import {sendEmail} from '../Utils/sendEmail.js';
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import Token from "../Model/authTokenModel.js";
import dotenv from "dotenv"
import PendingModel from "../Model/PendingModel.js";
dotenv.config();
export const test = (req, res, next) => {
    res.status(200).json({message:'Hello JusticeAdvocates!'});
}

export const SignUp = asyncWrapper(async (req, res, next) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        next(new BadRequestError(errors.array()[0].msg));
    }
    
    // checking if password matches
    if (req.body.Password !== req.body.confirmPassword) {
        return next(new BadRequestError("Passwords do not match"));
    }

    // checking if email is already in use
    const existingUser = await UserModel.findOne({ NationalID: req.body.NationalID});
    if (existingUser) {
        return next(new BadRequestError("NationalID is already in use"));
    }

    // hashing the user password
    const hashedPassword = await bcryptjs.hashSync(req.body.Password, 10);

    // generating OTP and setting expiration date
    const otp = otpGenerator();
    const otpExpirationDate = new Date().getTime() + (60 * 1000 * 5);

    // if user is a local leader (Mutwarasibo or Mudugudu), save in Pending Users
    if (req.body.UserType === 'Mutwarasibo' || req.body.UserType === 'Mudugudu') {
        // Create a new pending user entry
        const newPendingUser = new PendingModel({
            FullName: req.body.FullName,
            Telephone: req.body.Telephone,
            Province: req.body.Province,
            District: req.body.District,
            Sector: req.body.Sector,
            Cell: req.body.Cell,
            Village: req.body.Village,
            Isibo: req.body.Isibo,
            Email: req.body.Email,
            NationalID: req.body.NationalID,
            Gender: req.body.Gender,
            Password: hashedPassword,
            UserType: req.body.UserType,
            otp: otp,
            otpExpires: otpExpirationDate,
            approved: false // Mark as not approved
        });
     console.log(PendingModel.id)
        // Save to PendingUsers collection
        await newPendingUser.save();

        // Send email to Gitifu for approval
        const emailRecipient = process.env.GEmail;  // Assuming Gitifu email is stored here
        const emailSubject = "Approval Request for Local Leaders";
        const htmlBody = `
        <p>Dear ${process.env.GName},</p>
        <p>I kindly request your approval for the following individual as a local leader:</p>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Role:</strong> Mutwarasibo</p>
        <p><strong>Location:</strong> Indashyikirwa</p>
        <p>
            Please confirm their role by clicking one of the options below:
        </p>
        <table>
            <tr>
                <td>
                    <a href="http://localhost:2005/api_docs/CaseChain/user/approve?userId=${newPendingUser.id}&status=yes"
                        style="background-color: green; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Approve
                    </a>
                </td>
                <td style="width: 20px;"></td>
                <td>
                    <a href="http://localhost:2005/CaseChain/user/approve?userId=${newPendingUser.id}&status=no"
                        style="background-color: red; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reject
                    </a>
                </td>
            </tr>
        </table>
        <p>Thank you,<br>Case Chain Team</p>
    `;
    
        await sendEmail(emailRecipient, emailSubject, htmlBody);

        return res.status(201).json({
            message: "Account is pending approval by Gitifu.",
            user: newPendingUser
        });
    }

    // If user is not a local leader, create normal user account
    const newUser = new UserModel({
        FullName: req.body.FullName,
        Telephone: req.body.Telephone,
        Province: req.body.Province,
        District: req.body.District,
        Sector: req.body.Sector,
        Cell: req.body.Cell,
        Village: req.body.Village,
        Isibo: req.body.Isibo,
        Email: req.body.Email,
        NationalID: req.body.NationalID,
        Gender: req.body.Gender,
        Password: hashedPassword,
        UserType: req.body.UserType,
        otp: otp,
        otpExpires: otpExpirationDate
    });

    const savedUser = await newUser.save();
    await sendEmail(req.body.Email, "Verify your account", `Your OTP is ${otp}`);
    
    if (savedUser) {
        return res.status(201).json({
            message: "User account created!",
            user: savedUser
        });
    }
});

export const Validateopt=asyncWrapper(async(req,res,next)=>
{
    //validation 
    const errors=  validationResult(req);
    if(!errors.isEmpty())
    {
        return next(new BadRequestError(errors.array()[0].msg))
    }
    // checking if given opt is stored in our database
    const FounderUser=await UserModel.findOne({otp:req.body.otp})
    if(!FounderUser)
    {
        next(new UnauthorizedError('Authorization denied'));
    };
    // checking if otp is expired or not
    if(FounderUser.otp.expires < new Date().getTime())
    {
        next(new UnauthorizedError('OTP expired'));
    }
    // Update the user to 
    FounderUser.verified = true;
    const savedUser = await FounderUser.save();
    if(savedUser)
    {
        return res.status(200).json({
            message:"User account verified!",
            user:savedUser
        })
    }

});
export const SignIn=asyncWrapper(async(req,res,next)=>
{
    //validation 
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return next(new BadRequestError(errors.array()[0].msg))
    }
    //find User
    const FoundUser=await UserModel.findOne({Email:req.body.Email})
    if(!FoundUser)
    {
        return next(new BadRequestError('Invalid Email or password'))

    };
    //check account verification
    //  if(FoundUser.verified==false)
    //  {
    //      return next(new BadRequestError('Account is not verified'))
    // }
    //Verify password
    const isPasswordVerified= await bcryptjs.compareSync(req.body.Password,FoundUser.Password)
    if(!isPasswordVerified)
    {
        return next(new BadRequestError('Invalid Password'))
    }
    //Generate token
    const token = jwt.sign({id:FoundUser.id,Email:FoundUser.Email,NationalId:FoundUser.NationalId},process.env.JWT_SECRET_KEY, {expiresIn:'24h'});

    res.status(200).json({
        message:"User account verified!",
        user:FoundUser,
        token:token
    });
});
 
export const getAllusers =  async (req, res, next) => {
    try{
        const getUsers = await UserModel.find();
        if(getUsers){
            return res.status(200).json({
                size: getUsers.length,
                getUsers
            })
        }
        
    }catch (error){
        next(error);  
    }}

export const Logout=asyncWrapper(async(req,res,next)=>
{
    //validation 
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return next(new BadRequestError(errors.array()[0].msg))
    }

  
 // Assuming you have a field in your user model to store the token
  // For example, let's assume it's called 'token'
  
  //Clear the token from the database
  UserModel.token = null; // or any mechanism to invalidate the token
  await UserModel.save(); // Save the updated user to the database
//   Token.token = null; // or any mechanism to invalidate the token
//   await Token.save(); // Save the updated user to the database

  res.status(200).json({ message: 'Logout successful' });  
})

export const ForgotPassword=asyncWrapper(async(req,res,next)=>
{
    //validation 
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return next(new BadRequestError(errors.array()[0].msg))
    }
    //find User
    const FoundUser=await UserModel.findOne({Email:req.body.Email})
    if(!FoundUser)
    {
        return next(new BadRequestError('Invalid Email or password'))
    }
    //Generate token
    const token=jwt.sign({id:FoundUser.id},process.env.JWT_SECRET_KEY,{expiresIn:"15m"})
    //Recording the token to the database
    await Token.create({
        token:token,
        user:FoundUser._id,
        expirationDate:new Date().getTime()+ (60*1000*5),
    });
    const link=`https://localhost:8080/reset-password?token=${token}&id=${FoundUser.id}`;
    const emailBody=`click on the link below  to reset your password \n\n${link}`;
    await sendEmail(req.body.Email,"Reset your password",emailBody);

    res.status(200).json({
        message:"we sent you a reset password link on yourn email"
    });
});

export const ResetPassword = asyncWrapper(async (req, res, next) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    };
    //checking if password match
    if(req.body.Password !== req.body.confirmPassword)
        {
            return next(new BadRequestError("Passwords do not match"));
        }
    // Verify token
    const decoded = await jwt.verify(req.body.token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
        return next(new BadRequestError("Invalid token!"));
    }
    const recordedToken = await Token.findOne({ token: req.body.token });
    if (decoded.id!= req.body.id || recordedToken.user!= req.body.id) {
        return next(new BadRequestError("Invalid token!"));
    }
    if (new Date(recordedToken.expirationDate).getTime() < new Date().getTime()) {
        return next(new BadRequestError("Token expired!"));
    }
    // Find user
    const foundUser = await UserModel.findById(req.body.id);
    if (!foundUser) {
        return next(new BadRequestError("User not found!"));
    };
    // Deleting the user token
    await Token.deleteOne({ token: req.body.token });
    // Harshing the user password
    const inputedPassword = await bcryptjs.hashSync(req.body.Password, 10);
    // Updating the user password
    foundUser.Password = inputedPassword;
    const savedUser = await foundUser.save();
    if (savedUser) {
        return res.status(200).json({
            message: "Your password has been reset!",
        })
    }
   });


