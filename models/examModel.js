import mongoose from "mongoose";
const questionArr = mongoose.Schema({
  question: { type: String },
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
},
);

const Quiz = mongoose.model("Quiz", postQuizSchema);

export default Quiz;
