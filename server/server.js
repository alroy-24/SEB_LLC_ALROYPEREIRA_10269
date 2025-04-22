require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Course = require('./models/Course');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Get user's enrolled courses and reviews
app.get('/api/users/:userId/enrolled-courses', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const enrolledCourses = await Course.find({ 
      '_id': { $in: user.enrolledCourses } 
    });

    res.json(enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/:userId/reviews', async (req, res) => {
  try {
    const courses = await Course.find({
      'reviews.userId': req.params.userId
    });

    const userReviews = [];
    courses.forEach(course => {
      course.reviews
        .filter(review => review.userId.toString() === req.params.userId)
        .forEach(review => {
          userReviews.push({
            ...review.toObject(),
            courseCode: course.code,
            courseName: course.name
          });
        });
    });

    res.json(userReviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update the enrollment endpoint
app.post('/api/courses/:courseCode/enroll', async (req, res) => {
  try {
    const { courseCode } = req.params;
    const { userId } = req.body;

    console.log('Enrollment request:', { courseCode, userId }); // Debug log

    // Find the course by code
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      console.log('Course not found:', courseCode); // Debug log
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId); // Debug log
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check if already enrolled
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Check if course is full
    if (course.currentEnrollment >= course.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Course is full'
      });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(course._id);
    await user.save();

    // Update course enrollment count
    course.currentEnrollment += 1;
    await course.save();

    console.log('Enrollment successful:', { courseCode, userId }); // Debug log

    res.status(200).json({
      success: true,
      message: `Successfully enrolled in course ${courseCode}`,
      courseCode: courseCode
    });
  } catch (error) {
    console.error('Server error during enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during enrollment'
    });
  }
});

// Get course reviews
app.get('/api/courses/:courseCode/reviews', async (req, res) => {
  try {
    const course = await Course.findOne({ code: req.params.courseCode });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({
      averageRating: course.averageRating,
      reviews: course.reviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a review
app.post('/api/courses/:courseCode/reviews', async (req, res) => {
  try {
    console.log('Received review submission:', req.body); // Log the received data
    const { rating, review, userId, username } = req.body;

    // Validate the input
    if (!rating || !review || !userId || !username) {
      console.log('Missing required fields:', { rating, review, userId, username });
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { rating, review, userId, username }
      });
    }

    const course = await Course.findOne({ code: req.params.courseCode });
    console.log('Found course:', course?.code); // Log if course was found
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Add the review
    const newReview = {
      rating,
      review,
      userId,
      username,
      createdAt: new Date()
    };
    
    console.log('Adding review:', newReview); // Log the review being added
    course.reviews.push(newReview);

    // Save and handle any validation errors
    try {
      await course.save();
      console.log('Review saved successfully');
    } catch (saveError) {
      console.error('Error saving review:', saveError);
      return res.status(500).json({ 
        message: 'Error saving review',
        error: saveError.message 
      });
    }

    // Send success response
    res.json({
      message: 'Review added successfully',
      averageRating: course.averageRating
    });
  } catch (error) {
    console.error('Server error in review submission:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Add this after your other routes
app.post('/api/courses/init', async (req, res) => {
  try {
    const llcCourses = [
      {
        code: "LLC101",
        name: "Culinary Arts and Food Science",
        description: "Explore the science of cooking, food safety, nutrition, and culinary techniques. Learn about different cuisines and develop practical cooking skills.",
        category: "Arts and Culture",
        credits: 2,
        instructor: "Chef Sharma",
        schedule: "Friday and Saturday, 8:45 AM - 10:45 AM",
        location: "Culinary Lab 101",
        prerequisites: "None",
        maxCapacity: 30,
        currentEnrollment: 15,
        reviews: [],
        syllabus: [
          "Introduction to Culinary Science",
          "Food Safety and Hygiene",
          "Nutrition Basics",
          "Cooking Techniques",
          "World Cuisines",
          "Menu Planning",
          "Food Presentation"
        ]
      },
      {
        code: "LLC102",
        name: "Digital Photography and Visual Storytelling",
        description: "Master digital photography techniques, composition, lighting, and photo editing. Create compelling visual narratives through photography.",
        category: "Arts and Culture",
        credits: 2,
        instructor: "Prof. Mehta",
        schedule: "Friday and Saturday, 8:45 AM - 10:45 AM",
        location: "Media Lab 202",
        prerequisites: "None",
        maxCapacity: 25,
        currentEnrollment: 18,
        reviews: [],
        syllabus: [
          "Camera Basics and Settings",
          "Composition Techniques",
          "Lighting Fundamentals",
          "Photo Editing",
          "Visual Storytelling",
          "Portfolio Development",
          "Exhibition Planning"
        ]
      },
      {
        code: "LLC103",
        name: "Yoga and Mindfulness",
        description: "Practice traditional yoga asanas, pranayama, and meditation techniques. Learn about yoga philosophy and its application in daily life.",
        category: "Health and Wellness",
        credits: 2,
        instructor: "Dr. Patel",
        schedule: "Friday and Saturday, 8:45 AM - 10:45 AM",
        location: "Wellness Center 103",
        prerequisites: "None",
        maxCapacity: 20,
        currentEnrollment: 12,
        reviews: [],
        syllabus: [
          "Introduction to Yoga Philosophy",
          "Basic Asanas",
          "Breathing Techniques",
          "Meditation Practices",
          "Mindfulness in Daily Life",
          "Stress Management",
          "Holistic Wellness"
        ]
      },
      {
        code: "LLC104",
        name: "Theatre and Performing Arts",
        description: "Study acting techniques, stagecraft, and theatrical production. Participate in live performances and develop public speaking skills.",
        category: "Arts and Culture",
        credits: 2,
        instructor: "Prof. Kumar",
        schedule: "Friday and Saturday, 8:45 AM - 10:45 AM",
        location: "Auditorium 104",
        prerequisites: "None",
        maxCapacity: 25,
        currentEnrollment: 20,
        reviews: [],
        syllabus: [
          "Acting Fundamentals",
          "Voice and Movement",
          "Character Development",
          "Script Analysis",
          "Stage Presence",
          "Theatre Production",
          "Final Performance"
        ]
      },
      {
        code: "LLC105",
        name: "Environmental Science and Sustainability",
        description: "Understand environmental challenges, conservation, and sustainable practices. Participate in hands-on projects and field studies.",
        category: "Science and Environment",
        credits: 2,
        instructor: "Dr. Singh",
        schedule: "Friday and Saturday, 8:45 AM - 10:45 AM",
        location: "Science Lab 105",
        prerequisites: "None",
        maxCapacity: 30,
        currentEnrollment: 22,
        reviews: [],
        syllabus: [
          "Environmental Basics",
          "Climate Change",
          "Conservation Methods",
          "Sustainable Practices",
          "Field Research",
          "Project Planning",
          "Environmental Impact Assessment"
        ]
      },
      {
        code: "LLC106",
        name: "Music Appreciation",
        description: "Explore different genres of music, music theory, and instrumental techniques. Develop music appreciation and basic performance skills.",
        category: "Arts and Culture",
        credits: 2,
        instructor: "Prof. Rao",
        schedule: "Friday and Saturday, 8:45 AM - 10:45 AM",
        location: "Music Room 106",
        prerequisites: "None",
        maxCapacity: 25,
        currentEnrollment: 15,
        reviews: [],
        syllabus: [
          "Music Theory Basics",
          "World Music Genres",
          "Instrumental Techniques",
          "Music History",
          "Music Analysis",
          "Performance Practice",
          "Concert Appreciation"
        ]
      },
      {
        code: "LLC107",
        name: "Creative Writing",
        description: "Develop creative writing skills in various genres including poetry, fiction, and creative non-fiction. Learn storytelling techniques.",
        category: "Language and Literature",
        credits: 2,
        instructor: "Dr. Gupta",
        schedule: "Friday and Saturday, 8:45 AM - 10:45 AM",
        location: "Literature Lab 107",
        prerequisites: "None",
        maxCapacity: 25,
        currentEnrollment: 18,
        reviews: [],
        syllabus: [
          "Writing Fundamentals",
          "Poetry Writing",
          "Fiction Writing",
          "Creative Non-fiction",
          "Story Structure",
          "Character Development",
          "Publishing Workshop"
        ]
      },
      {
        code: "LLC108",
        name: "Personal Finance and Investment",
        description: "Learn financial planning, budgeting, investment strategies, and money management skills for personal growth.",
        category: "Life Skills",
        credits: 2,
        instructor: "Prof. Verma",
        schedule: "Friday and Saturday, 8:45 AM - 10:45 AM",
        location: "Finance Lab 108",
        prerequisites: "None",
        maxCapacity: 30,
        currentEnrollment: 25,
        reviews: [],
        syllabus: [
          "Financial Planning Basics",
          "Budgeting Techniques",
          "Investment Fundamentals",
          "Risk Management",
          "Tax Planning",
          "Retirement Planning",
          "Personal Portfolio Management"
        ]
      }
    ];

    // Clear existing courses
    await Course.deleteMany({});

    // Insert new courses
    await Course.insertMany(llcCourses);

    console.log('Courses initialized successfully');
    res.json({ message: 'Courses initialized successfully' });
  } catch (error) {
    console.error('Error initializing courses:', error);
    res.status(500).json({ message: 'Failed to initialize courses' });
  }
});

// Add this with your other middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /api/test');
  console.log('- POST /api/courses/:courseCode/enroll');
  console.log('- GET /api/courses/:courseCode/reviews');
  console.log('- POST /api/courses/:courseCode/reviews');
  console.log('- POST /api/courses/init');
}); 