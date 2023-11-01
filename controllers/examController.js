import asyncHandler from "express-async-handler";
import Quiz from "../models/examModel.js";

// Create a new exam
const createExam = asyncHandler(async (req, res) => {
  const data = await Quiz.create(req.body);
  res.status(201).json(data);
});

// Get an exam by ID
const getExamById = asyncHandler(async (req, res) => {
  const data = await Quiz.findById(req.params.id);
  if (!data) {
    res.status(404);
    throw new Error("Exam not found");
  }
  res.json(data);
});

// Get all exams
const getAllExams = asyncHandler(async (req, res) => {
  const data = await Quiz.find({});
  res.json(data);
});

export { getExamById, createExam, getAllExams };
