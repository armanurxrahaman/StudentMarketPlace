import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiEdit2, FiRefreshCw, FiPlusCircle, FiGift, FiStar, FiMail, FiLock, FiUser } from 'react-icons/fi';

// Helper to retrieve a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Helper: Fetch balance from backend given a userId (from query param)
async function fetchBalance(userId) {
  try {
    const response = await fetch(`http://localhost:3000/users/get_bal?userId=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data.balance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
}

// StarRating Component with updated styling
const StarRating = ({ sellerId }) => {
  const [rating, setRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isHovering, setIsHovering] = useState(null);

  useEffect(() => {
    async function fetchRating() {
      try {
        const response = await fetch(`http://localhost:3000/ratings/get?sellerId=${sellerId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        if (response.ok) {
          setRating(data.averageRating);
          setSelectedRating(Math.round(data.averageRating));
        } else {
          setRating(0);
          setSelectedRating(0);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
        setRating(0);
        setSelectedRating(0);
      }
    }
    fetchRating();
  }, [sellerId]);

  const submitRating = async () => {
    try {
      const response = await fetch("http://localhost:3000/ratings/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, points: selectedRating }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Error rating seller");
      } else {
        toast.success("Seller rated successfully!");
      }
    } catch (error) {
      console.error("Error rating seller:", error);
      toast.error("An error occurred while rating seller.");
    }
  };

  if (rating === null) return (
    <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>
  );

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
              star <= (isHovering || selectedRating) 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
            onMouseEnter={() => setIsHovering(star)}
            onMouseLeave={() => setIsHovering(null)}
            onClick={() => setSelectedRating(star)}
          />
        ))}
        <button 
          onClick={submitRating}
          className="ml-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <span>Rate</span>
        </button>
      </div>
      <div className="text-sm text-gray-600">Current Rating: {rating.toFixed(1)}</div>
    </div>
  );
};

function Profile() {
  const navigate = useNavigate();

  // State for user info
  const [user, setUser] = useState({
    username: '',
    email: '',
    role: 'Student',
    balance: 0,
    about: '',
  });
  
  // States for editing fields
  const [editMode, setEditMode] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newAbout, setNewAbout] = useState('');

  // State for Add Balance UI
  const [addBalanceMode, setAddBalanceMode] = useState(false);
  const [balanceToAdd, setBalanceToAdd] = useState('');

  // State for orders list
  const [orders, setOrders] = useState([]);

  // State for rating: which seller we are rating (if needed, but here we show rating for each seller in each order)
  // For this implementation, we'll render a StarRating component for every unique seller in an order.

  // Load user info and orders on mount
  useEffect(() => {
    loadUserInfo();
    loadOrders();
  }, []);

  // Async function to load user info from cookie and update balance from backend
  async function loadUserInfo() {
    const rawUserInfo = getCookie('userInfo');
    if (rawUserInfo) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
        const fetchedBalance = await fetchBalance(parsed.userId);
        setUser({
          username: parsed.username || 'Unknown',
          email: parsed.usermail || 'No Email',
          role: 'Student',
          balance: fetchedBalance,
          about: parsed.about || 'This is your about section. Click edit to modify.',
        });
      } catch (error) {
        console.error('Error parsing userInfo cookie:', error);
      }
    }
  }

  // Function to allow Charity account
  const handleRequestDonation = async () => {
    const rawUserInfo = getCookie('userInfo');
    if (!rawUserInfo) {
      toast.error("User not authenticated.");
      return;
    }
    try {
      const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
      const response = await fetch(`http://localhost:3000/users/donation?userId=${parsed.userId}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Donation status ACTIVE");
      } else {
        toast.error(data.error || "Failed to update donation status");
      }
    } catch (error) {
      console.error("Error setting donation status", error);
      toast.error("An error occurred while setting donation status");
    }
  };

  // Function to load orders for the logged-in user using user_id as a query parameter
  async function loadOrders() {
    const rawUserInfo = getCookie('userInfo');
    if (rawUserInfo) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
        const response = await fetch(`http://localhost:3000/orders/get?user_id=${parsed.userId}`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.orders) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    }
  }

  // Handlers for edit mode
  const handleEditClick = () => {
    setEditMode(true);
    setNewEmail(user.email);
    setNewPassword('');
    setNewAbout(user.about);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setNewEmail('');
    setNewPassword('');
    setNewAbout('');
  };

  const handleSave = async () => {
    if (!newEmail || !newPassword) {
      toast.error('Please provide both a new email and password.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          about: newAbout,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Error updating user info');
      } else {
        toast.success('User info updated successfully');
        setUser((prev) => ({
          ...prev,
          email: newEmail,
          about: newAbout,
        }));
        setEditMode(false);
        document.cookie = `userInfo=${encodeURIComponent(
          JSON.stringify({ ...user, email: newEmail, about: newAbout })
        )}; path=/;`;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while updating user info.');
    }
  };

  // Handlers for Add Balance
  const handleToggleAddBalance = () => {
    setAddBalanceMode((prev) => !prev);
    setBalanceToAdd('');
  };

  const handleAddBalance = async () => {
    if (!balanceToAdd || isNaN(balanceToAdd) || Number(balanceToAdd) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/users/add_balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: Number(balanceToAdd),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Error updating balance');
      } else {
        toast.success('Balance added successfully');
        setUser((prev) => ({
          ...prev,
          balance: data.balance,
        }));
        setAddBalanceMode(false);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      toast.error('An error occurred while updating balance.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - User Info */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-teal-600">
                  {user.username ? user.username[0].toUpperCase() : '?'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <p className="text-teal-100">{user.role}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3 text-gray-600">
                <FiMail className="w-5 h-5" />
                <span>{user.email}</span>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="bg-teal-50 rounded-xl p-4">
                  <h3 className="text-teal-800 font-semibold flex items-center">
                    <span className="mr-2 text-lg">₹</span>
                    Balance
                  </h3>
                  <p className="text-2xl font-bold text-teal-600 mt-1">
                    ₹ {user.balance}
                  </p>
          </div>
                
                <div className="mt-4 space-y-3">
                  <button
                    onClick={handleToggleAddBalance}
                    className="w-full flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <FiPlusCircle className="w-5 h-5" />
                    <span>{addBalanceMode ? "Cancel" : "Add Balance"}</span>
            </button>
                  
            {addBalanceMode && (
                    <div className="flex space-x-2">
                <input
                  type="number"
                        placeholder="Amount"
                  value={balanceToAdd}
                  onChange={(e) => setBalanceToAdd(e.target.value)}
                        className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                      <button
                        onClick={handleAddBalance}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 rounded-lg transition-colors duration-200"
                      >
                        Add
                </button>
              </div>
            )}
                  
                  <button
                    onClick={loadUserInfo}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <FiRefreshCw className="w-5 h-5" />
                    <span>Refresh Profile</span>
            </button>
                  
                  <button
                    onClick={handleRequestDonation}
                    className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <FiGift className="w-5 h-5" />
                    <span>Request Donation</span>
            </button>
                </div>
              </div>
          </div>
        </div>

          {/* Right Panel - Profile Details & Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">Profile Details</h3>
            {!editMode && (
                    <button
                      onClick={handleEditClick}
                      className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors duration-200"
                    >
                      <FiEdit2 className="w-5 h-5" />
                      <span>Edit Profile</span>
              </button>
            )}
          </div>
              </div>

              <div className="p-6 space-y-6">
                {/* About Section */}
            <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">About</h4>
              {editMode ? (
                <textarea
                  value={newAbout}
                  onChange={(e) => setNewAbout(e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="4"
                      placeholder="Tell us about yourself..."
                />
              ) : (
                    <p className="text-gray-600">{user.about}</p>
              )}
                </div>

                {/* Edit Form */}
            {editMode && (
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                      >
                        Save Changes
                  </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors duration-200"
                      >
                    Cancel
                  </button>
                </div>
              </div>
            )}

                {/* Orders Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-700">Orders</h4>
                    <button
                      onClick={loadOrders}
                      className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors duration-200"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const uniqueSellerIds = [...new Set(order.items.map((item) => item.seller_id))];
                        return (
                          <div key={order.id} className="bg-gray-50 rounded-xl p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="text-lg font-semibold text-gray-800">Order #{order.order_id}</h5>
                                <p className="text-gray-600">Total: Rs. {order.total_price}</p>
                              </div>
                            </div>
                            {order.delivery_address && (
                              <div className="text-sm text-gray-600">
                                Delivery Address: {order.delivery_address}
                              </div>
                            )}
                            <div className="border-t border-gray-200 pt-4">
                              <h6 className="text-sm font-semibold text-gray-700 mb-3">Rate Sellers</h6>
                              <div className="space-y-3">
                                {uniqueSellerIds.map((sellerId) => (
                                  <div key={sellerId} className="bg-white rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-2">Seller ID: {sellerId}</p>
                                    <StarRating sellerId={sellerId} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
