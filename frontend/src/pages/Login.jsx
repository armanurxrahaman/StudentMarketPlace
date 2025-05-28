import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiLogIn, FiUserPlus } from 'react-icons/fi';
import backgroundVideo from '../assets/videoplayback.mp4'; // Import the video

const API_URL = 'https://studentmarketplace-backend.onrender.com';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // POST request to your backend login endpoint
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent and received
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Login failed');
      } else {
        toast.success(data.message || 'Login successful');
        // Set the authentication cookie manually (if your backend doesn't do it automatically)
        document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(data.user))}; path=/;`;
        // Store userId in localStorage for request features
        localStorage.setItem('userId', data.user.userId);
        navigate('/home');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="relative">
      {/* Video Background */}
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover z-0">
        <source src={backgroundVideo} type="video/mp4" />
        {/* Add more source types if needed for broader browser support */}
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full opacity-20 blur-2xl"></div>
            </div>
            <div className="relative text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center mb-4">
                <FiUser className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                Sign in to your EduShare account
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 appearance-none block w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 appearance-none block w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FiLogIn className="h-5 w-5 text-teal-100 group-hover:text-white transition-colors duration-200" />
                  </span>
                  Sign in
                </button>

                <Link 
                  to="/signup"
                  className="w-full flex justify-center py-3 px-4 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                >
                  <FiUserPlus className="h-5 w-5 mr-2" />
                  Create new account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
