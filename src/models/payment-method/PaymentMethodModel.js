import PaymentMethodSchema from "./PaymentMethodSchema.js";

//CRUD
//Create
export const insertPaymentMethod = (obj) => {
  return PaymentMethodSchema(obj).save();
};
//Read
export const getPaymentMethods = () => {
  return PaymentMethodSchema.find();
};
//Update
export const updatePaymentMethodById = ({ _id, ...update }) => {
  return PaymentMethodSchema.findByIdAndUpdate(_id, update, { new: true });
};
//Delete
export const deletePaymentMethodById = (_id) => {
  return PaymentMethodSchema.findByIdAndDelete(_id);
};
