import express from "express";
import { hashPassword } from "../helpers/bcryptHelpers.js";
import { newAdminUserValidation } from "../middlewares/joi-validation/adminUserValidation.js";
import { insertAdminUser } from "../models/AdminUserModel.js";
import { v4 as uuidv4 } from "uuid";
import { verificationEmail } from "../helpers/emailHelper.js";

const router = express.Router();

//Server side validation
//encrypt user password
//insert into the db
//create  unique verificaton code
//send create a like pointin to our frontend with the email and verification code and send to their email

router.post("/", newAdminUserValidation, async (req, res, next) => {
  try {
    const { password } = req.body; //Fronted password

    req.body.password = hashPassword(password); //Overwriten the password of forntend with encrypted bcrypt password;
    req.body.emailValidationCode = uuidv4(); // Adding another object in the req.body

    const user = await insertAdminUser(req.body);
    if (user?._id) {
      res.json({
        status: "success",
        message:
          "We have send an email to verify your account, Please check your email box including junk folder",
      });

      const url = `${process.env.ROOT_DOMAIN}/admin/verify-email?c=${user.emailValidationCode}&e=${user.email}`;

      //Send email
      verificationEmail({
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        url,
      });
      return;
    }

    res.json({
      status: "error",
      message: "Unabel to create a admin user, Please try again ",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.status = 200;
      error.message =
        "There is already another user with this email, either reset password or use different email";
    }
    next(error);
  }
});
router.patch("/", (req, res, next) => {
  try {
    console.log(req.body);
    res.json({
      status: "success",
      message: "verify email to do create new user",
    });
  } catch (error) {
    next(error);
  }
});
export default router;
