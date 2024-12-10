import mongoose from 'mongoose';
import PendingModel from '../Model/PendingModel.js';
import UserModel from '../Model/userModel.js';
import { otpGenerator } from "../Utils/otp.js";
import { sendEmail } from '../Utils/sendEmail.js';

const approveController = async (req, res) => {
    const { Userid, status } = req.query;

    // Generate OTP and expiration date
    const otp = otpGenerator();
    const otpExpirationDate = new Date().getTime() + (60 * 1000 * 5);

    try {
        // Validate query parameters
        if (!Userid || !mongoose.Types.ObjectId.isValid(Userid)) {
            return res.status(400).json({ message: "Invalid or missing Userid." });
        }
        if (!status) {
            return res.status(400).json({ message: "Invalid status. Must be 'yes' or 'no'." });
        }

        // Find user in PendingModel
        const pendingUser = await PendingModel.findById(Userid);
        if (!pendingUser) {
            return res.status(404).json({ message: "User not found in pending approvals." });
        }

        if (status === 'yes') {
            // Approve user
            const newUser = new UserModel({
                FullName: pendingUser.FullName,
                Telephone: pendingUser.Telephone,
                NationalID: pendingUser.NationalID,
                Gender: pendingUser.Gender,
                Password: pendingUser.Password,
                Email: pendingUser.Email,
                Province: pendingUser.Province,
                District: pendingUser.District,
                Sector: pendingUser.Sector,
                Cell: pendingUser.Cell,
                Village:pendingUser.Village,
                Isibo: pendingUser.Isibo,
                UserType: pendingUser.UserType,
                otp: otp,
                otpExpires: otpExpirationDate,
                approved: true,
                accountStatus:"Active"
            });

            const savedUser = await newUser.save();

            try {
                await sendEmail(pendingUser.Email, "Verify your account", `Your OTP is ${otp}`);
            } catch (emailError) {
                console.error("Error sending email:", emailError);
                return res.status(500).json({ message: "Error sending email." });
            }

            await PendingModel.findByIdAndDelete(Userid);

            return res.status(200).json({
                message: `User ${pendingUser.FullName} has been approved and moved to UserModel.`,
                user: savedUser,
            });
        } else if (status === 'no') {
            // Reject user
            await PendingModel.findByIdAndDelete(Userid);

            return res.status(200).json({
                message: `User ${pendingUser.FullName} has been rejected and removed from pending approvals.`,
            });
        } else {
            return res.status(400).json({ message: "Invalid status. Must be 'yes' or 'no'." });
        }
    } catch (error) {
        console.error("Error in approveController:", error);
        res.status(500).json({ message: "An error occurred while processing the approval." });
    }
};

export default approveController;
