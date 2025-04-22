import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function EnrollButton({ course, onEnrollmentChange }) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const availableSeats = course.maxCapacity - course.currentEnrollment;
  const isFullyEnrolled = availableSeats === 0;

  const handleEnroll = async () => {
    if (!user) {
      setError('Please log in to enroll in courses');
      return;
    }

    try {
      setIsEnrolling(true);
      setError(null);

      const response = await axios.post(
        `http://localhost:5000/api/courses/${course.code}/enroll`,
        { userId: user.id },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        onEnrollmentChange(course.code);
        alert(`Successfully enrolled in ${course.name}!`);
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the server is running.');
      } else {
        setError(err.response?.data?.message || 'Failed to enroll. Please try again.');
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-center text-gray-600">
            Please <Link to="/login" className="text-blue-600 hover:text-blue-700">log in</Link> to enroll in courses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900">Enrollment Status</h2>
        <div className="mt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Available Seats:</span>
              <span className="text-gray-900">
                {availableSeats} of {course.maxCapacity}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  availableSeats === 0 
                    ? 'bg-red-600' 
                    : availableSeats <= 5 
                      ? 'bg-yellow-600' 
                      : 'bg-green-600'
                }`}
                style={{ 
                  width: `${(course.currentEnrollment / course.maxCapacity) * 100}%` 
                }}
              />
            </div>
          </div>
          <div className="mt-4">
            <button 
              className={`w-full px-4 py-2 rounded transition-colors ${
                isFullyEnrolled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isEnrolling
                    ? 'bg-blue-400 cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              onClick={handleEnroll}
              disabled={isFullyEnrolled || isEnrolling}
            >
              {isFullyEnrolled 
                ? 'Course Full' 
                : isEnrolling 
                  ? 'Enrolling...' 
                  : 'Enroll Now'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnrollButton;
