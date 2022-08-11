import Joi from "joi";
import {
  ADDRESS,
  FNAME,
  LNAME,
  EMAIL,
  PASSWORD,
  SHORTSTR,
  validator,
} from "./constant.js";

export const newAdminUserValidation = (req, res, next) => {
  //define rules
  const schmea = Joi.object({
    fName: FNAME.required(),
    lName: LNAME.required(),
    email: EMAIL.required(),
    password: PASSWORD.required(),
    phone: PHONE,
    address: ADDRESS,
    dob: DATE.allow("", null),
  });
  //give data to the rules
  validator(schmea, req, res, next);
};

export const emailVerificationValidation = (req, res, next) => {
  const schmea = Joi.object({
    email: EMAIL.required(),
    emailValidationCode: SHORTSTR.required(),
  });
  validator(schmea, req, res, next);
};
export const loginValidation = (req, res, next) => {
  const schmea = Joi.object({
    email: EMAIL.required(),
    password: PASSWORD.required(),
  });
  validator(schmea, req, res, next);
};
