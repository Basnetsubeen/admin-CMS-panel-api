import PoductSchema from "./PoductSchema.js";

//get product
export const getAllProducts = () => {
  return PoductSchema.find();
};

export const getSelectedProducts = (filter) => {
  return PoductSchema.find(filter);
};
export const getSingleProduct = (filter) => {
  return PoductSchema.find(filter);
};
//Insert Poducts
export const addProduct = (obj) => {
  return PoductSchema(obj).save();
};

//Update products
export const updateProductById = ({ _id, ...rest }) => {
  return PoductSchema.findByIdAndUpdate(_id, rest);
};
//Delete products
export const deleteProductById = (_id) => {
  return PoductSchema.findByIdAndDelete(_id);
};
