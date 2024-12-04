import userRoute from "./userRoute.js";
import express from "express";
import caseRoute from './caseRoute.js'
//import ContactRoute from "./contactRoute1.js"
const route = express.Router();

route.use("/user", userRoute);
route.use("/case", caseRoute);
export default route;