import mongoose from "mongoose";
const quizAttemptedSchema = mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quizResult: [],
});
const userSchema = mongoose.Schema({
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
  Points: Number,
  quizAttempted: [quizAttemptedSchema],
});
const User = mongoose.model("User", userSchema);

export default User;
