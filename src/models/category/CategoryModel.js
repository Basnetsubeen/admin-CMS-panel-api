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
//update a catergory
export const updateCategoryById = ({ _id, ...update }) => {
  return CategorySchema.findByIdAndUpdate(_id, update, { new: true });
};
//update a catergory by child
export const hasChildCategoryById = async (parentId) => {
  const category = await CategorySchema.findOne({ parentId });
  return category?._id ? true : false;
};
//delete category
export const deleteCategorybyId = (_id) => {
  return CategorySchema.findByIdAndDelete(_id);
};
