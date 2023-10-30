import mongoose from "mongoose";
const quizAttemptedSchema = mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quizResult: [],
});
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  Points: Number,
  quizAttempted: [quizAttemptedSchema],
});
const User = mongoose.model("User", userSchema);

export default User;
