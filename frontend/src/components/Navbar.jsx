import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  useEffect(() => {
    const userInfo = getCookie('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userInfo));
        setLoggedIn(true);
        if (parsed.flag === true) {
          setShowRequest(true);
        } else {
          setShowRequest(false);
        }
      } catch (error) {
        setLoggedIn(false);
        setShowRequest(false);
      }
    } else {
      setLoggedIn(false);
      setShowRequest(false);
    }
  }, [location]);

  const handleLogout = () => {
    document.cookie = 'userInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setLoggedIn(false);
    setShowRequest(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-teal-600 font-semibold' : 'text-gray-600 hover:text-teal-600';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-teal-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
                EduShare
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {loggedIn && (
              <Link
                to="/home"
                className={`${isActive('/home')} px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-teal-50`}
              >
                Home
              </Link>
            )}
            {loggedIn ? (
              <>
                <Link
                  to="/profile"
                  className={`${isActive('/profile')} px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-teal-50`}
                >
                  Profile
                </Link>
                <Link
                  to="/add-item"
                  className={`${isActive('/add-item')} px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-teal-50`}
                >
                  Add Item
                </Link>
                <Link
                  to="/cart" 
                  className={`${isActive('/cart')} px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-teal-50 flex items-center space-x-1`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Cart</span>
                </Link>
                <Link
                  to="/delivery" 
                  className={`${isActive('/delivery')} px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-teal-50`}
                >
                  Delivery
                </Link>
                {showRequest && (
                  <Link
                    to="/request" 
                    className={`${isActive('/request')} px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-teal-50`}
                  >
                    Request
                  </Link>
                )}
                <Link to="/my-requests" className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-teal-50">My Requests</Link>
                <Link to="/seller-requests" className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-teal-50">Purchase Requests</Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${isActive('/login')} px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-teal-50`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-teal-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {loggedIn && (
              <Link
                to="/home"
                className={`${isActive('/home')} block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            )}
            {loggedIn ? (
              <>
                <Link
                  to="/profile"
                  className={`${isActive('/profile')} block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/add-item"
                  className={`${isActive('/add-item')} block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Add Item
                </Link>
                <Link
                  to="/cart"
                  className={`${isActive('/cart')} block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Cart</span>
                </Link>
                <Link
                  to="/delivery"
                  className={`${isActive('/delivery')} block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Delivery
                </Link>
                {showRequest && (
                  <Link
                    to="/request"
                    className={`${isActive('/request')} block px-3 py-2 rounded-md text-base font-medium`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Request
                  </Link>
                )}
                <Link
                  to="/my-requests"
                  className="block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Requests
                </Link>
                <Link
                  to="/seller-requests"
                  className="block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Purchase Requests
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${isActive('/login')} block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

