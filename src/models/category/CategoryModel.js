import CategorySchema from "./CategorySchema.js";

//insert Category
export const insertCategory = (obj) => {
  return CategorySchema(obj).save();
};

//get categories
export const getAllCategories = () => {
  return CategorySchema.find();
};

//get a catergory
export const getCategoryById = (_id) => {
  return CategorySchema.findById(_id);
};
//delete category
export const deleteCategory = (_id) => {
  return CategorySchema.findOneAndDelete(_id);
};
