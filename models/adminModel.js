import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
  {
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
    
  },
  {
    timestamps: true,
  },
  { typeKey: "$type" }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;