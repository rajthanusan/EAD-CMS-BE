const User = require('../models/User');
const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');




const getStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: 'student' })
    .select('name email createdAt')
    .sort({ name: 1 });
  
  res.status(200).json(students);
});




const getStudent = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id)
    .select('name email createdAt');
  
  if (!student || student.role !== 'student') {
    res.status(404);
    throw new Error('Student not found');
  }
  
  res.status(200).json(student);
});




const deleteStudent = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id);
  
  if (!student || student.role !== 'student') {
    res.status(404);
    throw new Error('Student not found');
  }
  
  
  await Course.updateMany(
    { enrolledStudents: student._id },
    { $pull: { enrolledStudents: student._id } }
  );
  
  await User.deleteOne({ _id: student._id });
  
  res.status(200).json({ 
    success: true, 
    message: 'Student deleted successfully' 
  });
});




const getStudentEnrollments = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id);
  
  if (!student || student.role !== 'student') {
    res.status(404);
    throw new Error('Student not found');
  }
  
  const enrollments = await Course.find({ enrolledStudents: student._id })
    .select('code title credits instructor enrollmentCount capacity')
    .populate('enrolledStudents', 'name email');
  
  res.status(200).json({
    student: {
      _id: student._id,
      name: student.name,
      email: student.email
    },
    enrollments
  });
});

module.exports = {
  getStudents,
  getStudent,
  deleteStudent,
  getStudentEnrollments
};