import express from "express";
import {
  createExam,
  getExamById,
  getAllExams,
} from "../controllers/examController.js";
import { protect, admin, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Define routes using a consistent pattern
router.route("/")
  .post(protectAdmin, admin, createExam) // POST /api/exams
  .get(protect, getAllExams); // GET /api/exams

router.route("/all-exams")
  .get(protect, getAllExams); // GET /api/exams/all-exams

router.route("/:id")
  .get(protect, getExamById); // GET /api/exams/:id

export default router;
