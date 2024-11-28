import {addNewContact,ListContact,findbyUser,updateContact,deleteContact} from "../controller/ContactController.js"
import express from "express";

const router = express.Router();
router.post("/add",addNewContact, addNewContact);
router.get("/list", ListContact);
router.get("/findbyUser/:id", findbyUser);
router.put("/update/:id", updateContact);
router.delete("/delete/:id", deleteContact);

export default router;
