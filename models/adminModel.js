import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = mongoose.Schema(
  {
    picture: {
      type: String,
      required: true,
      default: " ",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      require:true,
      default:false
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: true,
    },
    emailVerficationCode: {
      data: String,
      default: "",
    },
    
  },
  {
    timestamps: true,
  },
  { typeKey: "$type" }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;