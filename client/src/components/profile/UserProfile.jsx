import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserProfile() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem('token');
        const [coursesResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${user.id}/enrolled-courses`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/users/${user.id}/reviews`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setEnrolledCourses(coursesResponse.data);
        setUserReviews(reviewsResponse.data);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600">Please log in to view your profile</h2>
          <Link to="/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* User Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Information</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Enrolled Courses</h2>
          {enrolledCourses.length > 0 ? (
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.code} className="border-b pb-4">
                  <Link 
                    to={`/course/${course.code}`}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {course.name}
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't enrolled in any courses yet.</p>
          )}
        </div>

        {/* User Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Reviews</h2>
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review._id} className="border-b pb-4">
                  <Link 
                    to={`/course/${review.courseCode}`}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {review.courseName}
                  </Link>
                  <div className="flex items-center mt-1">
                    <div className="text-yellow-400">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{review.review}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't written any reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
