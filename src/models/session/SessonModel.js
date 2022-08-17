import SessionSchema from "./SessionSchema.js";

export const insertSession = (obj) => {
  return SessionSchema(obj).save();
};
