import AdminUserSchema from "./AdminUserSchema.js";

//inset adminUser
export const insertAdminUser = (obj) => {
  return AdminUserSchema(obj).save();
};
