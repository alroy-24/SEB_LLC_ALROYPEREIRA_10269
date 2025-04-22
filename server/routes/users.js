const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');

// Get user's enrolled courses
router.get('/:userId/enrolled-courses', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('enrolledCourses');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reviews
router.get('/:userId/reviews', async (req, res) => {
  try {
    const courses = await Course.find({
      'reviews.userId': req.params.userId
    });

    const reviews = courses.flatMap(course => 
      course.reviews
        .filter(review => review.userId.toString() === req.params.userId)
        .map(review => ({
          ...review.toObject(),
          courseCode: course.code,
          courseName: course.name
        }))
    );

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 