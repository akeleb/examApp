import express from "express";

import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  verifyEmail,
  setVerifiedEmailCode,
  forgotPassword,
  resetPassword,
  checkEnrollment,
  enrollment,
  userCourses,
  markCompleted,
  listCompleted,
} from "../controllers/userController.js";

import { protect, admin, protectAdmin } from "../middleware/authMiddleware.js";
import Admin from "../models/adminModel.js";

const router = express.Router();
router.route("/").post(registerUser).get(protectAdmin, admin, getUsers);
router.post("/login", authUser);
router.post("/email-verification", verifyEmail);
router.post("/set-Verified-EmailCode", setVerifiedEmailCode);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.route("/checkenrollment/:id").get(protect, checkEnrollment);
router.route("/enrollment/:id").post(protect, enrollment);
router.route("/usercourses").get(protect, userCourses);
router.route("/completed").post(protect, markCompleted);
router.route("/listcompleted").post(protect, listCompleted);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .delete(protectAdmin, admin, deleteUser)
  .get(protectAdmin, admin, getUserById)
  .put(protectAdmin, admin, updateUser);

export default router;
