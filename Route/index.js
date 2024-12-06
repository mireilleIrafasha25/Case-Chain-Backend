import express from "express";
import userRoute from "./userRoute.js";
import caseRoute from './caseRoute.js'
import Contactroute from"./contactRoute1.js"
const route = express.Router();
route.use("/user", userRoute);
route.use("/case", caseRoute);
route.use("/contact", Contactroute);
export default route;