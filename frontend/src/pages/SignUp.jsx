import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiUserPlus, FiArrowRight } from 'react-icons/fi';
import backgroundVideo from '../assets/videoplayback.mp4';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Prepare payload: fullName is used as username, email as usermail
    const payload = {
      username: formData.fullName,
      usermail: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error signing up');
      } else {
        toast.success(data.message || 'Sign up successful');
        // Optionally redirect to login
        navigate('/login');
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("An error occurred during sign up.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
                <FiUserPlus className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                Create Account
              </h2>
              <p className="mt-2 text-sm text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                Join our EduShare community and start trading
              </p>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiUser className="w-4 h-4 mr-2 text-teal-600" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiMail className="w-4 h-4 mr-2 text-teal-600" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="student@university.edu"
                  />
                </div>
              </div>
              
              {/* Password Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiLock className="w-4 h-4 mr-2 text-teal-600" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiLock className="w-4 h-4 mr-2 text-teal-600" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                >
                  <span className="absolute right-3 inset-y-0 flex items-center pl-3">
                    <FiArrowRight className="h-5 w-5 text-teal-100 group-hover:text-white transition-colors duration-200" />
                  </span>
                  Create Account
                </button>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <Link 
                  to="/login"
                  className="inline-flex items-center text-sm text-teal-600 hover:text-teal-500 transition-colors duration-200"
                >
                  <FiUser className="w-4 h-4 mr-2" />
                  Already have an account? Sign in
                </Link>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-xs text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
