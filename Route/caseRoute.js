import express from 'express';
import {addCase, getAllCase,getCaseDetails, updateCase} from "../controller/caseController.js"
import {validateNewCase} from "../Utils/validation.js"
import {authenticateToken} from "../Middleware/authethicateToken.js"

const route = express.Router()
 route.post("/addCase",authenticateToken,validateNewCase,addCase)
 route.get("/getAllCase",getAllCase)
 route.get("/getCaseById/:id",getCaseDetails)
 route.patch("/updateCase/:id",authenticateToken,updateCase)

 export default route;