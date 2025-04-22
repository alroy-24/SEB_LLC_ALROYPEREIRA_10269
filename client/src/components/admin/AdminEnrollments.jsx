import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  const fetchEnrollmentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch course statistics
      const statsResponse = await axios.get('http://localhost:5000/api/admin/courses/stats', { headers });
      setCourseStats(statsResponse.data);

      // Fetch all enrollments with detailed information
      const enrollmentsResponse = await axios.get('http://localhost:5000/api/admin/enrollments', { headers });
      setEnrollments(enrollmentsResponse.data);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch enrollment data');
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`http://localhost:5000/api/admin/students/${studentId}/details`, { headers });
      setStudentDetails(response.data);
    } catch (err) {
      setError('Failed to fetch student details');
    }
  };

  const handleStudentSelect = async (enrollment) => {
    if (selectedStudent?.studentId === enrollment.studentId) {
      setSelectedStudent(null);
      setStudentDetails(null);
    } else {
      setSelectedStudent(enrollment);
      await fetchStudentDetails(enrollment.studentId);
    }
  };

  if (loading) return <div>Loading enrollment data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Course Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Course Enrollment Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseStats.map((course) => (
            <div key={course.code} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium">{course.name}</h3>
              <p className="text-gray-600">Code: {course.code}</p>
              <p className="text-gray-600">
                Enrolled: {course.currentEnrollment}/{course.maxCapacity}
              </p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2"
                  style={{
                    width: `${(course.currentEnrollment / course.maxCapacity) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Enrollments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Student Enrollment History</h2>
        <div className="grid gap-4">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.studentId}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{enrollment.studentName}</h3>
                  <p className="text-gray-600">{enrollment.email}</p>
                </div>
                <button
                  onClick={() => handleStudentSelect(enrollment)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {selectedStudent?.studentId === enrollment.studentId ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              {selectedStudent?.studentId === enrollment.studentId && studentDetails && (
                <div className="mt-4">
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Enrolled Courses:</h4>
                    <div className="grid gap-4">
                      {studentDetails.courses.map((course) => (
                        <div key={course.code} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{course.name}</h5>
                              <p className="text-sm text-gray-600">Code: {course.code}</p>
                              <p className="text-sm text-gray-600">
                                Enrolled: {new Date(course.enrollmentDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                Status: <span className="text-green-600">Active</span>
                              </p>
                            </div>
                          </div>
                          
                          {/* Course Details */}
                          <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                              <h6 className="text-sm font-medium">Course Information</h6>
                              <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                              <p className="text-sm text-gray-600">Schedule: {course.schedule}</p>
                              <p className="text-sm text-gray-600">Location: {course.location}</p>
                            </div>
                            <div>
                              <h6 className="text-sm font-medium">Progress</h6>
                              <p className="text-sm text-gray-600">
                                Attendance: {course.attendance || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-600">
                                Current Grade: {course.grade || 'N/A'}
                              </p>
                            </div>
                          </div>

                          {/* Course Reviews */}
                          {course.reviews && course.reviews.length > 0 && (
                            <div className="mt-3">
                              <h6 className="text-sm font-medium">Student Reviews</h6>
                              {course.reviews.map((review, index) => (
                                <div key={index} className="mt-2 text-sm text-gray-600">
                                  <p>Rating: {review.rating}/5</p>
                                  <p>{review.review}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEnrollments;
