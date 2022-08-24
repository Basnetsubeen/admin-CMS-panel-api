import jwt from "jsonwebtoken";
import { updatOneAdminUser } from "../models/AdminUserModel.js";
import { deleteSession, insertSession } from "../models/session/SessonModel.js";

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

export const verifyAccessJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch ({ message }) {
    console.log(message);
    if (message === "jwt expired") {
      //delete jwt form session table
      deleteSession({
        type: "jwt",
        token: accessJWT,
      });
    }
    return message;
  }
};
