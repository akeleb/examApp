import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Completed from "../models/completedModel.js";
import { hashPassword, comparePassword } from "../utils/auth.js";
import { nanoid } from "nanoid";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @desc..................Auth user & get token
//@route..................Post /api/users/login
//@access ................Public
const authUser = asyncHandler(async (req, res) => {
  const { isVerified, email, password } = req.body;
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
  if (!user.isVerified) {
    res.status(400);
    throw new Error("your email is not verified");
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
      phone: user.phone,
      picture: user.picture,
      isVerified: user.isVerified,
      cohort: user.cohort,
      trainingPath: user.trainingPath,
      credlyLink: user.credlyLink,
      numOfCerts: user.numOfCerts,
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
    phone,
    password,
    picture,
    cohort,
    trainingPath,
    credlyLink,
    numOfCerts,
  } = req.body;
  if (
    !name ||
    !email ||
    !phone ||
    !password ||
    !picture ||
    !cohort ||
    !trainingPath ||
    !credlyLink ||
    !numOfCerts
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
    phone,
    cohort,
    trainingPath,
    credlyLink,
    numOfCerts,
    password: hashedPassword,
    picture,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      cohort: user.cohort,
      trainingPath: user.trainingPath,
      credlyLink: user.credlyLink,
      numOfCerts: user.numOfCerts,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
  try {
    const { isVerified, email } = req.body;
    const userfound = await User.findOne({ email }).exec();
    const check = await User.findOne({ email, isVerified: true }).exec();

    if (!userfound) {
      return res.status(400).send("No user found with this email");
    }

    if (check) {
      return res
        .status(400)
        .send("your email is already verified, please login to your account");
    }
    const vCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { emailVerficationCode: vCode }
    );
    // prepare for email
    const msg = {
      to: user.email, // Change to your recipient
      from: {
        name: "Nedamco Academy",
        email: "email@neciacademy.com",
      },
      subject: "Your email verification Code",
      text: "pleas use the code below to verify your email",
      html: `<p> 
      <h3>Nedamco Academy</h3>
      <h1 style="color:#0b86ba;"> Email verification code</h1>
      <h2 style="color:#7f03fc;"> Hello ${user.name}, </h2>
      <br> To access Our service's,
       Please use the following code to verify your email address.
       <br>Your verification code is: <b>${vCode}</b>
       <p style="color:blue;">Please do not replay to this email</p>
       </p>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        res.json({ ok: true });
      })
      .catch((error) => {
        console.error(error);
        console.log(process.env.SENDGRID_API_KEY);
      });
  } catch (err) {
    console.log(err);
  }
});

// @desc..................get user profile
//@route..................GET /api/users/profile
//@access ................private
const getUserProfile = asyncHandler(async (req, res) => {
  // const user = await User.findOne(req.user._id);
  // console.log(req.user);
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      picture: user.picture,
      cohort: user.cohort,
      trainingPath: user.trainingPath,
      credlyLink: user.credlyLink,
      numOfCerts: user.numOfCerts,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc..................update user profile
//@route..................PUT /api/users/profile
//@access ................private
const updateUserProfile = asyncHandler(async (req, res) => {
  // const user = await User.findOne(req.user._id);
  // console.log(req.user);
  const user = await User.findById(req.user._id);
  // console.log(user);

  if (user) {
    const chkemail = user.email;
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.credlyLink = req.body.credlyLink || user.credlyLink;
    user.numOfCerts = req.body.numOfCerts || user.numOfCerts;
    user.picture = req.body.picture || user.picture;
    if (req.body.password) {
      const hashedPassword = await hashPassword(req.body.password);
      user.password = hashedPassword;
    }
    if (chkemail !== req.body.email) {
      user.isVerified = false;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      picture: updatedUser.picture,
      isAdmin: updatedUser.isAdmin,
      isVerified: updatedUser.isVerified,
      credlyLink: updatedUser.credlyLink,
      numOfCerts: updatedUser.numOfCerts,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc..................Get all users
//@route..................PUT /api/users
//@access ................private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc..................Delete a user
//@route..................Delete /api/users/:id
//@access ................private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc..................Get all users
//@route..................PUT /api/users/:id
//@access ................private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found!");
  }
});

// @desc..................update user profile
//@route..................PUT /api/users/:id
//@access ................private/Admin
const updateUser = asyncHandler(async (req, res) => {
  // const user = await User.findOne(req.user._id);
  // console.log(req.user);
  const user = await User.findById(req.params.id);
  // console.log(user);

  if (user) {
    user.isVerified = false;
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc..................verify user identity via email
//@route..................PUT /api/users/verify-Email
//@access ...............puplic
const verifyEmail = async (req, res) => {
  try {
    const { isVerified, email } = req.body;
    const userfound = await User.findOne({ email }).exec();
    const check = await User.findOne({ email, isVerified: true }).exec();

    if (!userfound) {
      return res.status(400).send("No user found with this email");
    }

    if (check) {
      return res
        .status(400)
        .send("your email is already verified, please login to your account");
    }
    const vCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { emailVerficationCode: vCode }
    );
    // prepare for email
    const msg = {
      to: user.email, // Change to your recipient
      from: {
        name: "Nedamco Academy",
        email: "email@neciacademy.com",
      },
      subject: "Your email verification Code",
      text: "pleas use the verification code below to verify your email",
      html: `<p> 
      <h3>NEDAMCO ACADEMY</h3>
      <h1 style="color:#0b86ba;"> Email verification code, </h1>
      <h2 style="color:#7f03fc;"> Hello ${user.name}, </h2>
      <br> To access Our service's,
       Please use the following code to verify your email address.
       <br>Your verification code is: <b>${vCode}</b>
       <p style="color:blue;">Please do not replay to this email</p>
       </p>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        res.json({ ok: true });
      })
      .catch((error) => {
        console.error(error);
        console.log(process.env.SENDGRID_API_KEY);
      });
  } catch (err) {
    console.log(err);
  }
};
// @desc..................update user verification code
//@route..................PUT /api/users/verify-Email
//@access ...............puplic
const setVerifiedEmailCode = async (req, res) => {
  try {
    const { email, emailCode, isVerified } = req.body;
    // console.table({ email, code, newPassword });
    if (
      !(await User.findOne({ email, emailVerficationCode: emailCode }).exec())
    ) {
      return res.status(400).send("Incorrect email or verification code");
    }

    User.findOneAndUpdate(
      {
        email,
        emailVerficationCode: emailCode,
      },
      {
        emailVerficationCode: "",
        isVerified: true,
      }
    ).exec();

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! Try again.");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );

    if (!user) return res.status(400).send("User not found with this email");

    // prepare for email
    const msg = {
      to: user.email, // Change to your recipient
      from: {
        name: "Nedamco Academy",
        email: "email@neciacademy.com",
      },
      subject: "Your password reset Code",
      text: "pleas use the code below code to reset your password",
      html: `<p> 
      <h3> NEDAMCO ACADEMY </h3>
      <h1 style="color:#0b86ba;"> Password reset code, </h1>
      <h2 style="color:#7f03fc;"> Hello ${user.name}, </h2>
      <br> To access Our service's,
       Please use the following code to reset your password.
       <br>Your reset code is: <b>${shortCode}</b>
       <p style="color:blue;">Please do not replay to this email</p>
       </p>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        res.json({ ok: true });
      })
      .catch((error) => {
        console.error(error);
        console.log(process.env.SENDGRID_API_KEY);
      });
  } catch (err) {
    console.log(err);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    // console.table({ email, code, newPassword });
    if (!(await User.findOne({ email, passwordResetCode: code }).exec())) {
      return res.status(400).send("Incorrect email or secret code");
    } else if (!newPassword || newPassword.length < 4) {
      return res
        .status(400)
        .send("Password is required and should be min 4 characters long");
    }
    const hashedPassword = await hashPassword(newPassword);
    User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! Try again.");
  }
};
const checkEnrollment = async (req, res) => {
  // find courses of the currently logged in user
  const user = await User.findById(req.user._id);
  let ids = [];
  let length = user.courses.length;
  for (let i = 0; i < length; i++) {
    ids.push(user.courses[i].toString());
  }
  res.json({
    status: ids.includes(req.params.id),
    course: await Course.findById(req.params.id),
  });
};

const enrollment = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).exec();
    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { courses: course._id },
      },
      { new: true }
    ).exec();
    // console.log(result);
    res.json({
      message: "Congratulations! You have successfully enrolled",
      course,
    });
  } catch (err) {
    console.log("enrollment err", err);
    return res.status(400).send("Enrollment create failed");
  }
};

const userCourses = async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  const courses = await Course.find({ _id: { $in: user.courses } }).exec();
  res.json(courses);
};

const markCompleted = async (req, res) => {
  const { courseId, lessonId } = req.body;
  // console.log(courseId, lessonId);
  // find if user with that course is already created
  const existing = await Completed.findOne({
    user: req.user._id,
    course: courseId,
  }).exec();

  if (existing) {
    // update
    const updated = await Completed.findOneAndUpdate(
      {
        user: req.user._id,
        course: courseId,
      },
      {
        $addToSet: { lessons: lessonId },
      }
    ).exec();
    res.json({ ok: true });
  } else {
    // create
    const created = await new Completed({
      user: req.user._id,
      course: courseId,
      lessons: lessonId,
    }).save();
    res.json({ ok: true });
  }
};

const listCompleted = async (req, res) => {
  const { courseId } = req.body;
  try {
    const list = await Completed.findOne({
      user: req.user._id,
      course: courseId,
    }).exec();
    list && res.json(list.lessons);
  } catch (err) {
    console.log(err);
  }
};
export {
  authUser,
  getUserProfile,
  registerUser,
  verifyEmail,
  setVerifiedEmailCode,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  checkEnrollment,
  enrollment,
  userCourses,
  markCompleted,
  listCompleted,
};
