const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');


dotenv.config();


connectDB();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(cors());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enroll', require('./routes/enrollmentRoutes'));


app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Course Management API',
    version: '1.0.0'
  });
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});