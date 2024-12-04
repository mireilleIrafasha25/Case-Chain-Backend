import CaseModel from "../Model/caseModel.js";
import asyncWrapper from "../Middleware/async.js";
import UserModel from "../Model/userModel.js";
import {UnauthorizedError,BadRequestError, NotFoundError} from "../Error/index.js";
import { validationResult } from "express-validator";

export const addCase = asyncWrapper (async(req,res,next)=>{
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return next(new BadRequestError(errors.array()[0].msg))
    }

    const{caseTitle,description,caseOuner,currentLevel,expected_resolution_date} = req.body
  // Extract NationalId from the token
  const assignedToNationalId = req.user.NationalId;

 // Find the user by NationalId
 const user = await UserModel.findOne({ NationalId: assignedToNationalId });
 if (!user) {
     return next(new NotFoundError('User not found'));
 }

 const newCase = new CaseModel({
     caseTitle,
     description,
     caseOuner,
     currentLevel,
     expected_resolution_date,
     assignedTo: user._id // Use the found user's _id
 });

    const savedCase = await newCase.save();
    if(savedCase){
        return res.status(201).json({
            success: true,
            message: "case created successfully",
            
            data: savedCase
        })
    }
});

export const getAllCase = asyncWrapper(async(req,res,next)=>{
    const result = await CaseModel.find()
    if(result.length ===0){
        return next(new NotFoundError("No case Available"))
    }
    return res.status(200).json({
        success: true,
        message: "case fetched successfully",
        size: result.length,
        data: result
    })
});

export const getCaseDetails = asyncWrapper(async (req, res, next) => {
    const caseId = req.params.id;  // Get the case ID from the request params

    // Find the case by ID and populate the 'assignedTo' field (get the full name of the assigned user)
    const caseData = await CaseModel.findById(caseId)
        .populate('assignedTo', 'FullName role Telephone Cell Village')   // Populating assigned user's FullName
        .exec();

    if (!caseData) {
        return next(new NotFoundError("Case not found"));
    }

    // Fetch the user (citizen) who reported the case using their NationalId
    const reporter = await UserModel.findOne({ NationalId: caseData.caseOuner }).exec();

    if (!reporter) {
        return next(new NotFoundError("Citizen who reported the case not found"));
    }
    const caseOwner = {
        name: reporter.FullName,
        email: reporter.Email,
        telephone: reporter.Telephone,
        village: reporter.Village,
        cell: reporter.Cell,
        NationalId:reporter.NationalId
      };
      const caseReceiver = {
        name:caseData.assignedTo.FullName,
        role:caseData.assignedTo.role,
        telephone:caseData.assignedTo.Telephone,
        cell:caseData.assignedTo.Cell,
        village:caseData.assignedTo.Village
      }
    return res.status(200).json({
        success: true,
        message: "Case details fetched successfully",
        data: {
            caseTitle: caseData.caseTitle,
            description: caseData.description,
            status: caseData.status,
            caseOwner: caseOwner,  // Name of the citizen who reported the case
            assignedTo: caseReceiver,  // Name of the person handling the case
            currentLevel: caseData.currentLevel,
            expected_resolution_date: caseData.expected_resolution_date,
            updates: caseData.updates,  // Updates on the case
            createdAt: caseData.createdAt,
            updatedAt: caseData.updatedAt
        }
    });
});
