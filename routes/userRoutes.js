import express from "express";
import {
  authUser,
  registerUser,
} from "../controllers/userController.js";
import { protect, admin, protectAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();
router.route("/").post(registerUser).get(protectAdmin, admin, getUsers);
router.post("/login", authUser);
export default router;
