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
  NUMBER,
  DATE,
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

//  ======== products validation ========
export const newProductValidation = (req, res, next) => {
  const { salesPrice, salesStartDate, salesEndDate } = req.body;
  req.body.salesPrice = salesPrice ? salesPrice : 0;
  req.body.salesStartDate =
    !salesStartDate || salesStartDate === "null" ? null : salesStartDate;
  req.body.salesEndDate =
    !salesEndDate || salesEndDate === "null" ? null : salesEndDate;

  const schmea = Joi.object({
    status: STATUS.required(),
    name: SHORTSTR.required(),
    sku: SHORTSTR.required(),
    description: LONGSTR.required(),
    quantity: NUMBER.required(),
    price: NUMBER.required(),
    salesPrice: NUMBER,
    salesStartDate: DATE.allow(null),
    salesEndDate: DATE.allow(null),
    catId: SHORTSTR.required(),
  });
  validator(schmea, req, res, next);
};
