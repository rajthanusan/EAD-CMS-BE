const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');




const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  
  if (!course.enrolledStudents) {
    course.enrolledStudents = [];
  }
  
  
  if (course.enrolledStudents.includes(req.user.id)) {
    res.status(400);
    throw new Error('Already enrolled in this course');
  }
  
  
  if (course.enrolledStudents.length >= course.capacity) {
    res.status(400);
    throw new Error('Course is full');
  }
  
  
  course.enrolledStudents.push(req.user.id);
  await course.save();
  
  res.status(200).json({
    success: true,
    message: 'Successfully enrolled in course'
  });
});




const unenrollFromCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  
  if (!course.enrolledStudents) {
    course.enrolledStudents = [];
  }
  
  
  if (!course.enrolledStudents.includes(req.user.id)) {
    res.status(400);
    throw new Error('Not enrolled in this course');
  }
  
  
  course.enrolledStudents = course.enrolledStudents.filter(
    studentId => studentId.toString() !== req.user.id
  );
  
  await course.save();
  
  res.status(200).json({
    success: true,
    message: 'Successfully unenrolled from course'
  });
});




const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ 
    enrolledStudents: req.user.id 
  }).select('code title credits instructor');
  
  res.status(200).json(courses);
});

module.exports = {
  enrollInCourse,
  unenrollFromCourse,
  getMyCourses
};