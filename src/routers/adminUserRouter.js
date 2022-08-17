import express from "express";
import { comparePassword, hashPassword } from "../helpers/bcryptHelpers.js";
import {
  emailVerificationValidation,
  loginValidation,
  newAdminUserValidation,
} from "../middlewares/joi-validation/adminUserValidation.js";
import {
  findOneAdminUser,
  insertAdminUser,
  updatOneAdminUser,
} from "../models/AdminUserModel.js";
import { v4 as uuidv4 } from "uuid";
import {
  userVerificationNotification,
  verificationEmail,
} from "../helpers/emailHelper.js";
import { createJWTs } from "../helpers/jwtHelper.js";

const router = express.Router();

//Server side validation
//encrypt user password
//insert into the db
//create  unique verificaton code
//send create a like point in to our frontend with the email and verification code and send to their email

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
      //http://localhost:3000/admin/verify-email?c=abcde&ea@a.com//
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
//to verify the email
router.patch(
  "/verify-email",
  emailVerificationValidation,
  async (req, res, next) => {
    try {
      const { emailValidationCode, email } = req.body;
      console.log(req.body);
      const user = await updatOneAdminUser(
        {
          emailValidationCode,
          email,
        },
        {
          status: "active",
          emailValidationCode: "",
        }
      );
      user?._id
        ? res.json({
            status: "success",
            message: "Your account has been verified, You may login",
          }) && userVerificationNotification(user)
        : res.json({
            status: "error",
            message: "Invalid or expired link , no action was taken",
          });
    } catch (error) {
      next(error);
    }
  }
);
//Login admin
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const { password, email } = req.body;
    // find the user exist based on given email
    const user = await findOneAdminUser({ email });

    if (user?.status !== "active") {
      res.json({
        status: "error",
        message:
          "Your account has not been verified, please check your email and verify your account.",
      });
    }
    if (user?._id) {
      //we need to verify if the password send by the user and the hashed password store in the database is same
      const isMatched = comparePassword(password, user.password);
      if (isMatched) {
        user.password = undefined;

        //JWT should be ready to login successfully

        const jwts = await createJWTs({ email });

        return res.json({
          status: "success",
          message: "Login successfully",
          user,
          ...jwts,
        });
      }
    }
    {
    }
    res.json({
      status: "error",
      message: "Invalid login credentials",
    });
  } catch (error) {
    next(error);
  }
});
export default router;
