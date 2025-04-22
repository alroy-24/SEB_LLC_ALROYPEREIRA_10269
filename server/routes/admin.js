const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply auth middleware to all routes
router.use(auth);

// Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.put('/users/:userId/role', isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CRUD operations for courses
router.post('/courses', isAdmin, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/courses/:courseCode', isAdmin, async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { code: req.params.courseCode },
      req.body,
      { new: true }
    );
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/courses/:courseCode', isAdmin, async (req, res) => {
  try {
    await Course.findOneAndDelete({ code: req.params.courseCode });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course enrollment statistics
router.get('/courses/stats', isAdmin, async (req, res) => {
  try {
    const courses = await Course.find().select('code name currentEnrollment maxCapacity');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all enrollments with student details
router.get('/enrollments', isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .populate('enrolledCourses')
      .select('-password');

    const enrollments = users.map(user => ({
      studentId: user._id,
      studentName: user.username,
      email: user.email,
      courses: user.enrolledCourses.map(course => ({
        code: course.code,
        name: course.name,
        enrollmentDate: course.enrollmentDate || new Date(),
      }))
    }));

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed student information
router.get('/students/:studentId/details', isAdmin, async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId)
      .populate({
        path: 'enrolledCourses',
        populate: {
          path: 'reviews',
          match: { userId: req.params.studentId }
        }
      });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentDetails = {
      studentId: student._id,
      studentName: student.username,
      email: student.email,
      courses: student.enrolledCourses.map(course => ({
        code: course.code,
        name: course.name,
        description: course.description,
        instructor: course.instructor,
        schedule: course.schedule,
        location: course.location,
        enrollmentDate: course.enrollmentDate || new Date(),
        attendance: course.attendance,
        grade: course.grade,
        reviews: course.reviews,
        category: course.category,
        credits: course.credits
      }))
    };

    res.json(studentDetails);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 