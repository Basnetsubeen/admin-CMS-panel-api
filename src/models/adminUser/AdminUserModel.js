import AdminUserSchema from "./AdminUserSchema.js";

//inset adminUser
export const insertAdminUser = (obj) => {
  return AdminUserSchema(obj).save();
};
//update user
export const updatOneAdminUser = (filter, update) => {
  return AdminUserSchema.findOneAndUpdate(filter, update, { new: true });
};
//find one  admin user
export const findOneAdminUser = (filter) => {
  return AdminUserSchema.findOne(filter);
};
