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
        .populate('assignedTo', 'FullName role Telephone Cell Village')  // Populating assigned user's FullName
        .populate('updates.updateBy', 'FullName Telephone role Cell Village')  // Populating updateBy for each update
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
        NationalId: reporter.NationalId
    };

    const caseReceiver = {
        name: caseData.assignedTo.FullName,
        role: caseData.assignedTo.role,
        telephone: caseData.assignedTo.Telephone,
        cell: caseData.assignedTo.Cell,
        village: caseData.assignedTo.Village
    };

    // Modify updates array to include updateBy details
    const updates = caseData.updates.map(update => ({
        updateText: update.updateText,
        timestamp: update.timestamp,
        updateBy: {
            FullName: update.updateBy.FullName,
            Telephone: update.updateBy.Telephone,
            role: update.updateBy.role,
            Cell: update.updateBy.Cell,
            Village: update.updateBy.Village
        }
    }));

    return res.status(200).json({
        success: true,
        message: "Case details fetched successfully",
        data: {
            caseTitle: caseData.caseTitle,
            description: caseData.description,
            status: caseData.status,
            caseOwner,  // Name of the citizen who reported the case
            assignedTo: caseReceiver,  // Name of the person handling the case
            currentLevel: caseData.currentLevel,
            expected_resolution_date: caseData.expected_resolution_date,
            updates,  // Updates on the case with updateBy details
            createdAt: caseData.createdAt,
            updatedAt: caseData.updatedAt
        }
    });
});


export const updateCase = asyncWrapper(async (req, res, next) => {
    const paramId = req.params.id;

    // Ensure updateText field is present in the request body
    if (!req.body.updateText) {
        return res.status(400).json({
            success: false,
            message: "Update text is required"
        });
    }

    // Check if user data exists in req.user (from the token)
    if (!req.user || !req.user.NationalId) {
        return next(new UnauthorizedError('User data not found in token'));
    }

    // Extract NationalId from the token
    const updatedByNationalId = req.user.NationalId;

    // Find the user by NationalId
    const user = await UserModel.findOne({ NationalId: updatedByNationalId });
    if (!user) {
        return next(new NotFoundError('User not found'));
    }

    // Create the update object
    const update = {
        updateBy: user._id, // Use user._id for reference
        updateText: req.body.updateText,
        timestamp: new Date(),
        status:req.body.status,

    };

    // Push the update object to the updates array in the case document
    const result = await CaseModel.findByIdAndUpdate(
        paramId,
        { $push: { updates: update } },
        { new: true, runValidators: true }
    );

    if (!result) {
        return next(new NotFoundError("Case not found!"));
    }

    return res.status(200).json({
        success: true,
        message: "Case updated successfully",
    });
});

