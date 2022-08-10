import mongoose from "mongoose";

export const dbConnection = () => {
  try {
    const conStr = process.env.MONGO_CLIENT;

    if (!conStr) {
      return console.log(
        "There is no connection avaiable in process.env.MONGO_CLIENT"
      );
    }
    const conn = mongoose.connect(conStr);
    conn && console.log("mongobd Connected");
  } catch (error) {
    error && console.log(error);
  }
};
