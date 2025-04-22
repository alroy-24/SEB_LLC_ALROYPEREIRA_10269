import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminCourses from './AdminCourses';
import AdminUsers from './AdminUsers';
import AdminEnrollments from './AdminEnrollments';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Admin Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('courses')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'courses'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Manage Courses
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Manage Users
              </button>
              <button
                onClick={() => setActiveTab('enrollments')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'enrollments'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Enrollment Tracking
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'courses' && <AdminCourses />}
            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'enrollments' && <AdminEnrollments />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 