import asyncHandler from "express-async-handler";
import Quiz from "../models/examModel.js"
const createExam = asyncHandler(async (req, res) => {
  try {
    const data = await Quiz.create(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

const getExam = asyncHandler(async (req, res) => {
  try {
    const Data = await Quiz.findById(req.params.id);
    res.status(200).json(Data);
  } catch (err) {
    res.status(400).json(err);
  }
});

const getAllExams = asyncHandler(async (req, res) => {
  const data = await Quiz.find({});
  res.json(data);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (course) {
    await course.remove();
    res.json({ message: "Course removed successfully" });
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});



export {
  getExam,
  createExam,
  getAllExams
};
