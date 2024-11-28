import userRoute from "./userRoute.js";
import express from "express";
import ContactRoute from "./contactRoute1.js"
const route = express.Router();

route.use("/user", userRoute);
route.use("/contact", ContactRoute);
export default route;