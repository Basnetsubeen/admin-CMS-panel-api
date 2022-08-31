import express from "express";
import {
  newPaymentMethodValidation,
  updateCategoryValidation,
  updatePaymentMethodValidation,
} from "../middlewares/joi-validation/JoiValidation.js";
import {
  deletePaymentMethodById,
  getPaymentMethods,
  insertPaymentMethod,
  updatePaymentMethodById,
} from "../models/payment-method/PaymentMethodModel.js";

const router = express.Router();

//Get the payment method
router.get("/", async (req, res, next) => {
  try {
    const paymentMethod = await getPaymentMethods();
    res.json({
      status: "success",
      message: "to do",
      paymentMethod,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

//Post the different payment method
router.post("/", newPaymentMethodValidation, async (req, res, next) => {
  try {
    const paymentMethod = await insertPaymentMethod(req.body);

    paymentMethod?._id
      ? res.json({
          status: "success",
          message: "The new payment method has been added",
        })
      : res.json({
          status: "error",
          message: "Unabale to add the payment method, please try again",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message =
        "This payment method has been already exist, please use another one";
      error.status = 200;
    }

    next(error);
  }
});
//Update the payment method
router.put("/", updatePaymentMethodValidation, async (req, res, next) => {
  try {
    const paymentMethod = await updatePaymentMethodById(req.body);

    paymentMethod?._id
      ? res.json({
          status: "success",
          message: "The new payment method has been updated",
        })
      : res.json({
          status: "error",
          message: "Unabale to update the payment method, please try again",
        });
  } catch (error) {
    error.status = 500;
    next();
  }
});
//delete the payment method
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const paymentMethod = await deletePaymentMethodById(_id);

    paymentMethod?._id
      ? res.json({
          status: "success",
          message: "The new payment method has been deleted",
        })
      : res.json({
          status: "error",
          message: "Unabale to delete the payment method, please try again",
        });
  } catch (error) {
    error.status = 500;
    next();
  }
});

export default router;
