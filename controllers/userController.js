import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/auth.js";

// @desc..................Auth user & get token
//@route..................Post /api/users/login
//@access ................Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("please enter your email and password!");
  }
  const user = await User.findOne({ email: email });
  // const check = await User.findOne({ email, isVerified: true }).exec();

  if (!user) {
    res.status(401);
    throw new Error("user not found with this email");
  }
  const match = await comparePassword(password, user.password);
  if (!match) {
    res.status(401);
    throw new Error("Password is incorrect");
  }
  if (user && match && user.isVerified) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Something went wrong");
  }
});

//@desc..................Register a new user
//@route..................Post/api/users
//@access ................Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    } = req.body;
  if (
    !name ||
    !email ||
    !password
  
  ) {
    res.status(400);
    throw new Error("please enter all information");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("A user is found with the same email you entered");
  } else if (await User.findOne({ phone })) {
    throw new Error("A user found with the same phone number you entered");
  }
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export {
  authUser,
  registerUser,
};
