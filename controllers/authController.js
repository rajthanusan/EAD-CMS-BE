const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


const ADMIN_EMAIL = 'admin@university.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'System Administrator';




const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  
  const user = await User.create({
    name,
    email,
    password,
    role: 'student' 
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});




const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    res.status(400);
    throw new Error('Please add an email and password');
  }

  
  if (email === ADMIN_EMAIL) {
    if (password === ADMIN_PASSWORD) {
      
      let adminUser = await User.findOne({ email: ADMIN_EMAIL });
      
      if (!adminUser) {
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
        
        adminUser = await User.create({
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: 'admin'
        });
      }

      return res.json({
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        token: generateToken(adminUser._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid admin credentials');
    }
  }

  
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});




const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

module.exports = {
  register,
  login,
  getMe
};