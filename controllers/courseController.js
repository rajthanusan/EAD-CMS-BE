const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');




const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.status(200).json(courses);
});




const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  res.status(200).json(course);
});




const createCourse = asyncHandler(async (req, res) => {
  const { code, title, description, credits, instructor, capacity } = req.body;
  
  if (!code || !title) {
    res.status(400);
    throw new Error('Please add a code and title');
  }
  
  
  const courseExists = await Course.findOne({ code });
  
  if (courseExists) {
    res.status(400);
    throw new Error('Course already exists');
  }
  
  const course = await Course.create({
    code,
    title,
    description,
    credits,
    instructor,
    capacity
  });
  
  res.status(201).json(course);
});




const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(200).json(updatedCourse);
});




const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  await Course.deleteOne({ _id: req.params.id });
  
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
};