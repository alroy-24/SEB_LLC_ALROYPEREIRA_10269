// Add a review
app.post('/api/courses/:courseCode/reviews', async (req, res) => {
  try {
    const { rating, review, userId, username } = req.body;
    const course = await Course.findOne({ code: req.params.courseCode });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.reviews.push({
      rating,
      review,
      userId,
      username
    });
    await course.save();

    res.json({
      message: 'Review added successfully',
      averageRating: course.averageRating
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}); 