import mongoose from "mongoose";
const questionArr = mongoose.Schema({
  title: { type: String },
  questions: { type: String },
  options: [{ option: String, isCorrect: Boolean, id: Number }],
  correctAnswer: { type: String },
});
const postQuizSchema = mongoose.Schema({
  title: { type: String },
  questionArray: [questionArr],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const PostQuiz = mongoose.model("PostQuiz", postQuizSchema);

export default PostQuiz