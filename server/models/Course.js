const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: String,
  credits: Number,
  instructor: String,
  schedule: String,
  location: String,
  prerequisites: String,
  maxCapacity: Number,
  currentEnrollment: {
    type: Number,
    default: 0
  },
  outcomes: [{
    type: String,
    required: true
  }],
  topics: [{
    type: String,
    required: true
  }],
  assessment: {
    mentorAssessment: Number,
    attendance: Number,
    participation: Number,
    weeklyReflection: Number
  },
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0
  }
});

// Calculate average rating before saving
courseSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.averageRating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema); 