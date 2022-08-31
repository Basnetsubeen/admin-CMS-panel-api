import Joi from "joi";
import {
  ADDRESS,
  FNAME,
  LNAME,
  EMAIL,
  PASSWORD,
  SHORTSTR,
  validator,
  STATUS,
  LONGSTR,
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

// =======Categories =========//
export const newCategoryValidation = (req, res, next) => {
  req.body.parentId = req.body.parentId ? req.body.parentId : null;
  const schmea = Joi.object({
    status: STATUS,
    name: SHORTSTR.required(),
    parentId: SHORTSTR.allow(null, ""),
  });
  validator(schmea, req, res, next);
};

//update cateogory
export const updateCategoryValidation = (req, res, next) => {
  req.body.parentId = req.body.parentId ? req.body.parentId : null;
  const schmea = Joi.object({
    status: STATUS,
    name: SHORTSTR.required(),
    parentId: SHORTSTR.allow(null, ""),
    _id: SHORTSTR.required(),
  });
  validator(schmea, req, res, next);
};

//Payment method
export const newPaymentMethodValidation = (req, res, next) => {
  const schmea = Joi.object({
    status: STATUS,
    name: SHORTSTR.required(),
    description: LONGSTR.required(),
  });
  validator(schmea, req, res, next);
};
export const updatePaymentMethodValidation = (req, res, next) => {
  const schmea = Joi.object({
    _id: SHORTSTR.required(),
    status: STATUS.required(),
    name: SHORTSTR.required(),
    description: LONGSTR.required(),
  });
  validator(schmea, req, res, next);
};
