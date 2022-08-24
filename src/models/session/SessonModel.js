import SessionSchema from "./SessionSchema.js";

export const insertSession = (obj) => {
  return SessionSchema(obj).save();
};
//Find
export const getSession = (filter) => {
  return SessionSchema.findOne(filter);
};
//delete
export const deleteSession = (filter) => {
  return SessionSchema.findOneAndDelete(filter);
};
