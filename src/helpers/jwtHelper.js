import jwt from "jsonwebtoken";
import { updatOneAdminUser } from "../models/AdminUserModel.js";
import { insertSession } from "../models/session/SessonModel.js";

export const singleAccessJWT = async (payload) => {
  const accessJWT = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const obj = {
    token: accessJWT,
    type: "jwt",
  };

  await insertSession(obj);
  return accessJWT;
};
export const singleRefreshJWT = async (payload) => {
  const refreshJWT = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  await updatOneAdminUser(payload, { refreshJWT });
  return refreshJWT;
};

export const createJWTs = async (payload) => {
  return {
    accessJWT: await singleAccessJWT(payload),
    refreshJWT: await singleRefreshJWT(payload),
  };
};
