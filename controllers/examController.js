import asyncHandler from "express-async-handler";
import Course from "../models/courseModel.js";
import slugify from "slugify";

const createCourse = asyncHandler(async (req, res) => {
  const course = new Course({
    name: "Sample Course name",
    admin: req.admin._id,
    image: "/images/sampleimage.jpg",
    description: "Course description",
    category: "Course category",
    courseDuration: "1 month",
  });
  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

const getCourses = asyncHandler(async (req, res) => {
  const pageSize = 100;
  const page = Number(req.query.pageNumber) || 1;
  // const match = "new category"
  const count = await Course.count();
  const courses = await Course.find()
  // const courses = await Course.find({
  //   category: req.user.trainingPath,
  // })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({ courses, page, pages: Math.ceil(count / pageSize) });
});

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
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

const updateCourse = asyncHandler(async (req, res) => {
  const { name, image, description, category, courseDuration } = req.body;

  const course = await Course.findById(req.params.id);
  if (course) {
    course.name = name;
    course.slug = slugify(name);
    course.image = image;
    course.description = description;
    course.category = category;
    course.courseDuration = courseDuration;
    const updatedCourse = await course.save();
    res.status(201).json(updatedCourse);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

const createCourseLessons = asyncHandler(async (req, res) => {
  const { name, content, lessonDuration, lessonLink } = req.body;

  const course = await Course.findById(req.params.id);
  if (course) {
    const lesson = {
      name,
      slug: slugify(name),
      content,
      lessonDuration,
      lessonLink,
      admin: req.admin._id,
    };
    course.lessons.push(lesson);
    await course.save();
    res.status(201).json({ Message: "Lesson added successfully" });
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

const deleteCourseLessons = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  const { lessonId } = req.body;
  if (course) {
    await Course.findByIdAndUpdate(course._id, {
      $pull: { lessons: { _id: lessonId } },
    }).exec();
    res.status(200).send("lesson deleted successfuly");
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

export {
  getCourses,
  getCourseById,
  deleteCourse,
  updateCourse,
  createCourseLessons,
  createCourse,
  deleteCourseLessons,
  getAllCourses,
};
