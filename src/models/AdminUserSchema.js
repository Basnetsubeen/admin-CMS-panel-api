import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    fName: {
      type: String,
      required: true,
      maxLength: [20, "First name can't be more than 20 letters"],
    },
    lName: {
      type: String,
      required: true,
      maxLength: [20, "Last name can't be more than 20 letters"],
    },
    email: {
      type: String,
      unique: true,
      index: 1,
      required: true,
      maxLength: [50, "First name can't be more than 20 letters"],
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      maxLength: [20, "First name can't be more than 20 letters"],
    },
    address: {
      type: String,
      required: true,
      maxLength: [100, "First name can't be more than 20 letters"],
      default: "n/a",
    },
    dob: {
      type: String,
      deafult: null,
    },
    emailValidationCode: {
      type: String,
      default: "",
    },
    refreshJWT: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Admin-user", adminUserSchema);
