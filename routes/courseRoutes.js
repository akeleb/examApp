import express from "express";

import {
  createCourse,
  getCourses,
  getCourseById,
  deleteCourse,
  updateCourse,
  createCourseLessons,
  deleteCourseLessons,
  getAllCourses,
} from "../controllers/courseController.js";

import { protect, admin, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/mancourse").get(protectAdmin, admin, getCourses);
router.route("/mancourse/all").get(protectAdmin, admin, getAllCourses);
router
  .route("/mancourse/:id/lessons")
  .post(protectAdmin, admin, createCourseLessons)
  .put(protectAdmin, admin, deleteCourseLessons);

router
  .route("/mancourse/:id")
  .get(protectAdmin, admin, getCourseById)
  .delete(protectAdmin, admin, deleteCourse)
  .put(protectAdmin, admin, updateCourse);
router
  .route("/")
  .post(protectAdmin, admin, createCourse)
  .get(protect, getCourses);
router.route("/all-courses").get(protect, getAllCourses);
router.route("/:id").get(protect, getCourseById);

export default router;
