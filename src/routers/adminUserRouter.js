import express from "express";
import { comparePassword, hashPassword } from "../helpers/bcryptHelpers.js";
import {
  emailVerificationValidation,
  loginValidation,
  newAdminUserValidation,
  resetAdminPasswordUserValidation,
  updateAdminPasswordUserValidation,
  updateAdminUserValidation,
} from "../middlewares/joi-validation/JoiValidation.js";
import {
  findOneAdminUser,
  insertAdminUser,
  updatOneAdminUser,
} from "../models/adminUser/AdminUserModel.js";
import { v4 as uuidv4 } from "uuid";
import {
  otpNotification,
  userVerificationNotification,
  verificationEmail,
} from "../helpers/emailHelper.js";
import {
  createJWTs,
  singleAccessJWT,
  verifyRefreshJWT,
} from "../helpers/jwtHelper.js";
import { adminAuth } from "../middlewares/auth-middleware/authMiddleware.js";
import { createOTP } from "../utils/randonGenerator.js";
import { deleteSession, insertSession } from "../models/session/SessonModel.js";

const router = express.Router();

//Server side validation
//encrypt user password
//insert into the db
//create  unique verificaton code
//send create a like point in to our frontend with the email and verification code and send to their email

//get userAdmin
router.get("/", adminAuth, (req, res, next) => {
  try {
    const user = req.adminInfo;
    user.password = undefined;
    user.refreshJWT = undefined;
    res.json({
      status: "success",
      messsage: " to-do",
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", adminAuth, newAdminUserValidation, async (req, res, next) => {
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

router.put(
  "/",
  adminAuth,
  updateAdminUserValidation,
  async (req, res, next) => {
    try {
      const { _id, ...rest } = req.body;

      const result = await updatOneAdminUser({ _id }, rest);

      result?._id
        ? res.json({
            status: "success",
            message: "The user has been updated",
          })
        : res.json({
            status: "error",
            message: "Unable to update the user profile, Please try again!!",
          });
    } catch (error) {
      next(error);
    }
  }
);
//update password from user profile case
router.patch(
  "/",
  adminAuth,
  updateAdminPasswordUserValidation,
  async (req, res, next) => {
    try {
      const { password, _id, newPassword } = req.body;
      const userId = req.adminInfo._id.toString();
      if (_id !== userId) {
        return res.status(401).json({
          status: "error",
          message: "Invalid user request",
        });
      }
      const passFromDb = req.adminInfo.password;
      //first if the password is valid
      const isMatched = comparePassword(password, passFromDb);
      //encrypt the new password
      if (isMatched) {
        //update the password in the db
        const hashedPassword = hashPassword(newPassword);
        const result = await updatOneAdminUser(
          { _id },
          {
            password: hashedPassword,
          }
        );

        if (result?._id) {
          return res.json({
            status: "success",
            message: "Password has been successfully updated",
          });
        }
      }

      // const result = await updatOneAdminUser();

      res.json({
        status: "error",
        message: "Unable to update the passsord. please try again!!",
      });
    } catch (error) {
      next(error);
    }
  }
);
//public routers below here

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
    if (user?._id) {
      if (user?.status !== "active") {
        res.json({
          status: "error",
          message:
            "Your account has not been verified, please check your email and verify your account.",
        });
      }

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

//Generates new accessJWT and send back to the client
router.get("/accessjwt", async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      //verify the token
      const decoded = verifyRefreshJWT(authorization);
      console.log(decoded);

      //check if the exist in db
      if (decoded.email) {
        const user = await findOneAdminUser({ email: decoded.email });
        if (user?._id) {
          //create new accessjwt and return

          return res.json({
            status: "success",
            accessJWT: await singleAccessJWT({ email: decoded.email }),
          });
        }
      }
    }
    res.status(401).json({
      status: "error",
      message: "Unauthenticatd",
    });
  } catch (error) {
    error.status = 401;
    next(error);
  }
});

//password restet as logout user
router.post("/request-password-reset-otp", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (email.includes("@")) {
      //check if the user exist
      const user = await findOneAdminUser({ email });
      if (user?._id) {
        //create the unique code and store in the database with the email

        const object = {
          token: createOTP(),
          associate: email,
          type: "updatePassword",
        };
        const result = await insertSession(object);
        if (result?._id) {
          //create unique otp for the for the frontend that takes user to password update page
          //email the otp to the client
          otpNotification({
            otp: result.token,
            fName: result.associate,
            email,
          });
        }
      }
    }

    res.json({
      status: "success",
      message:
        "If the email exist in our system, we will send you an OTP, email and  reset instruction",
    });
  } catch (error) {
    next(error);
  }
});
//reset password
router.patch(
  "/reset-password",
  resetAdminPasswordUserValidation,
  async (req, res, next) => {
    try {
      const { email, otp, password } = req.body;
      const filter = {
        token: otp,
        associate: email,
        type: "updatePassword",
      };
      //find if the filter exist in the session table and delete it.

      const result = await deleteSession(filter);
      //if the delete is succeed,
      if (result?._id) {
        //then, encrypt the password and update the user table by ID
        const encrypted = hashPassword(password);

        const user = await updatOneAdminUser(
          { email },
          { password: encrypted }
        );
        if (user?._id) {
          return res.json({
            status: "success",
            message: "The password has been updated",
          });
        }
      }
      res.json({
        status: "error",
        message: "Invalid request",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
