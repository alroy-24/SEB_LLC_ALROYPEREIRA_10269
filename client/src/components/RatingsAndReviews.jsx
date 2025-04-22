import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function RatingsAndReviews({ courseCode }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const { user } = useAuth();

  // Fetch existing reviews
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseCode}/reviews`);
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // Fetch reviews on component mount and when courseCode changes
  useEffect(() => {
    fetchReviews();
  }, [courseCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to submit a review');
      return;
    }

    setSubmitting(true);
    setError(null);

    // Log the data being sent
    console.log('Submitting review with data:', {
      rating,
      review,
      userId: user.id,
      username: user.username
    });

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Log the token

      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseCode}/reviews`,
        {
          rating,
          review,
          userId: user.id,
          username: user.username
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Server response:', response.data); // Log the server response
      
      // Clear form after successful submission
      setRating(0);
      setReview('');
      
      // Refresh reviews after submission
      await fetchReviews();
    } catch (err) {
      console.error('Full error object:', err); // Log the full error
      console.error('Error response:', err.response?.data); // Log the error response data
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to render stars
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Ratings & Reviews</h2>
      
      {/* Average Rating Display */}
      {reviews.length > 0 && (
        <div className="mb-6 text-center">
          <div className="text-3xl text-yellow-400">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-gray-600">
            Average rating: {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
          </div>
        </div>
      )}

      {/* Rating Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Your Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Share your experience with this course..."
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className={`w-full py-2 px-4 rounded-lg ${
              submitting || rating === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <p className="text-gray-600">
            Please{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              sign in
            </Link>{' '}
            to submit a review
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="text-yellow-400">
                    {renderStars(review.rating)}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {review.username || 'Anonymous'}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.review}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No reviews yet. Be the first to review this course!
          </div>
        )}
      </div>
    </div>
  );
}

export default RatingsAndReviews;
