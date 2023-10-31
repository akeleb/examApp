import express from "express";

import {
  createExam,
  getExam,
  getAllExams
} from "../controllers/examController.js";
import { protect, admin, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protectAdmin, admin, createExam)
  .get(protect, getAllExams);
router.route("/all-exams").get(protect, getAllExams);
router.route("/:id").get(protect, getExamById);

export default router;
