import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive LLC course data
  const llcCourses = [
    {
      code: "LLC101",
      name: "Culinary Arts and Food Science",
      description: "Explore the science of cooking, food safety, nutrition, and culinary techniques. Learn about different cuisines and develop practical cooking skills.",
      category: "Arts and Culture",
      credits: 2,
      instructor: "Chef Sharma"
    },
    {
      code: "LLC102",
      name: "Digital Photography and Visual Storytelling",
      description: "Master digital photography techniques, composition, lighting, and photo editing. Create compelling visual narratives through photography.",
      category: "Arts and Culture",
      credits: 2,
      instructor: "Prof. Mehta"
    },
    {
      code: "LLC103",
      name: "Yoga and Mindfulness",
      description: "Practice traditional yoga asanas, pranayama, and meditation techniques. Learn about yoga philosophy and its application in daily life.",
      category: "Health and Wellness",
      credits: 2,
      instructor: "Dr. Patel"
    },
    {
      code: "LLC104",
      name: "Theatre and Performing Arts",
      description: "Study acting techniques, stagecraft, and theatrical production. Participate in live performances and develop public speaking skills.",
      category: "Arts and Culture",
      credits: 2,
      instructor: "Prof. Kumar"
    },
    {
      code: "LLC105",
      name: "Environmental Science and Sustainability",
      description: "Understand environmental challenges, conservation, and sustainable practices. Participate in hands-on projects and field studies.",
      category: "Science and Environment",
      credits: 2,
      instructor: "Dr. Singh"
    },
    {
      code: "LLC106",
      name: "Music Appreciation",
      description: "Explore different genres of music, music theory, and instrumental techniques. Develop music appreciation and basic performance skills.",
      category: "Arts and Culture",
      credits: 2,
      instructor: "Prof. Rao"
    },
    {
      code: "LLC107",
      name: "Creative Writing",
      description: "Develop creative writing skills in various genres including poetry, fiction, and creative non-fiction. Learn storytelling techniques.",
      category: "Language and Literature",
      credits: 2,
      instructor: "Dr. Gupta"
    },
    {
      code: "LLC108",
      name: "Personal Finance and Investment",
      description: "Learn financial planning, budgeting, investment strategies, and money management skills for personal growth.",
      category: "Life Skills",
      credits: 2,
      instructor: "Prof. Verma"
    }
  ];

  // Get unique categories
  const categories = ['All', ...new Set(llcCourses.map(course => course.category))];

  useEffect(() => {
    setCourses(llcCourses);
  }, []);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    // Reset category filter when searching
    if (term) setSelectedCategory('All');
  };

  // Filter courses based on both search term and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm.toLowerCase() === '' || 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Liberal Learning Courses
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Explore our diverse range of courses designed to enhance your learning experience
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Category Filter */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="mt-6 text-gray-600 text-center">
          Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
        </div>

        {/* Course Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div 
                key={course.code}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1 mr-2">
                      {course.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.code}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="text-gray-900 font-medium">{course.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Credits:</span>
                      <span className="text-gray-900 font-medium">{course.credits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Instructor:</span>
                      <span className="text-gray-900 font-medium">{course.instructor}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/course/${course.code}`}
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">
                No courses found matching your search criteria
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCatalog;
