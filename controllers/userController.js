import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/auth.js";

// Auth user and get a token
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter your email and password." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "User not found with this email." });
  }

  const passwordMatch = await comparePassword(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Password is incorrect." });
  }

  if (user.isVerified) {
    const token = generateToken(user._id);
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } else {
    return res.status(401).json({ message: "Something went wrong." });
  }
});

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all required information." });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "A user with the same email already exists." });
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    const token = generateToken(user._id);
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } else {
    return res.status(400).json({ message: "Invalid user data." });
  }
});

export {
  authUser,
  registerUser,
};
