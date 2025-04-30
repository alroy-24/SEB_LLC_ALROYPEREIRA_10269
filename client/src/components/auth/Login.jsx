import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'An error occurred during login');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Image and Welcome text */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center">
        <div className="max-w-md text-center text-white px-8">
          <h1 className="text-4xl font-bold mb-6">Welcome to LLC Portal</h1>
          <p className="text-xl mb-8">Your gateway to quality education and learning opportunities</p>
          <div className="bg-white/20 p-6 rounded-lg">
            <p className="text-lg">Join our community of learners and start your educational journey today.</p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 
                           border border-gray-300 text-gray-900 
                           placeholder-gray-500 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 
                           focus:border-blue-500 focus:z-10 
                           sm:text-sm bg-white"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ caretColor: '#1a365d' }}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 
                           border border-gray-300 text-gray-900 
                           placeholder-gray-500 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 
                           focus:border-blue-500 focus:z-10 
                           sm:text-sm bg-white"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ caretColor: '#1a365d' }}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 
                         border border-transparent rounded-lg text-white 
                         ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         transition duration-150 ease-in-out`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center">
              <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                Don't have an account? Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
