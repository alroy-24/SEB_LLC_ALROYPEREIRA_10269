import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EnrollButton from './EnrollButton';
import RatingsAndReviews from './RatingsAndReviews';

function CourseDetail() {
  const { courseCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const course = llcCourses.find(c => c.code === courseCode);
  const [courseData, setCourseData] = useState(course);

  const handleEnrollmentChange = () => {
    setCourseData(prev => ({
      ...prev,
      currentEnrollment: prev.currentEnrollment + 1
    }));
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-red-600">Course not found</h2>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to course catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-blue-600 hover:underline mb-4 block">
          ← Back to course catalog
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {course.code}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                <p className="mt-1 text-gray-600">{course.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">Course Details</h2>
                <dl className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Category:</dt>
                    <dd className="text-gray-900">{course.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Credits:</dt>
                    <dd className="text-gray-900">{course.credits}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Instructor:</dt>
                    <dd className="text-gray-900">{course.instructor}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Schedule:</dt>
                    <dd className="text-gray-900">{course.schedule}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Location:</dt>
                    <dd className="text-gray-900">{course.location}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Prerequisites:</dt>
                    <dd className="text-gray-900">{course.prerequisites}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Course Syllabus</h2>
                <ul className="mt-2 space-y-2">
                  {course.syllabus.map((topic, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-600">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <EnrollButton 
                course={courseData} 
                onEnrollmentChange={handleEnrollmentChange}
              />
            </div>
          </div>
        </div>

        <RatingsAndReviews courseCode={courseCode} />
      </div>
    </div>
  );
}

export default CourseDetail;
