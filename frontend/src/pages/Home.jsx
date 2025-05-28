import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { FiSearch, FiFilter, FiX, FiShoppingCart, FiStar } from 'react-icons/fi';
import { fetchItems, fetchItemById } from '../config/api';

// Helper to retrieve a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// SellerRating component: Fetches and displays seller's rating as stars
function SellerRating({ sellerId }) {
  const [rating, setRating] = useState(null);

  useEffect(() => {
    async function fetchRating() {
      try {
        const response = await fetch(`http://localhost:3000/ratings/get?sellerId=${sellerId}`);
        const data = await response.json();
        if (response.ok) {
          setRating(data.averageRating);
        } else {
          setRating(0);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
        setRating(0);
      }
    }
    fetchRating();
  }, [sellerId]);

  if (rating === null) return <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>;

  const roundedRating = Math.round(rating);
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }, (_, i) => (
        <FiStar
          key={i}
          className={`w-4 h-4 ${
            i < roundedRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
    </div>
  );
}

function Home() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    condition: "",
    grade: "",
    subject: "",
    maxPrice: 1000,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [ownerId, setOwnerId] = useState(null);
  const { addItemToCart } = useCart();
  const navigate = useNavigate();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedItemForRequest, setSelectedItemForRequest] = useState(null);

  useEffect(() => {
    const rawUserInfo = getCookie("userInfo");
    if (rawUserInfo) {
      try {
        const userInfo = JSON.parse(decodeURIComponent(rawUserInfo));
        setOwnerId(userInfo.userId);
      } catch (error) {
        console.error("Error parsing userInfo cookie:", error);
      }
    }
  }, []);

  const loadItems = async () => {
    try {
      const data = await fetchItems();
      setItems(data.items);
    } catch (error) {
      console.error("Error fetching items", error);
      toast.error("Error fetching items");
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const getFilteredItems = () => {
    return items.filter((item) => {
      if (searchQuery.trim() !== "" && !((item.name || "").toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      if (filters.category.trim() !== "" && !((item.category || "").toLowerCase().includes(filters.category.toLowerCase()))) {
        return false;
      }
      if (filters.condition.trim() !== "" && !((item.condition || "").toLowerCase().includes(filters.condition.toLowerCase()))) {
        return false;
      }
      if (filters.grade.trim() !== "" && !((item.grade || "").toLowerCase().includes(filters.grade.toLowerCase()))) {
        return false;
      }
      if (filters.subject.trim() !== "" && !((item.subject || "").toLowerCase().includes(filters.subject.toLowerCase()))) {
        return false;
      }
      if (Number(item.price) > Number(filters.maxPrice)) {
        return false;
      }
      return true;
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceSliderChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: e.target.value,
    }));
  };

  const handleItemClick = async (itemId) => {
    try {
      const data = await fetchItemById(itemId);
      setSelectedItem(data.item);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching item details:", error);
      toast.error("Error fetching item details");
    }
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  const handleRequestToBuy = async (item) => {
    const rawUserInfo = getCookie('userInfo');
    if (!rawUserInfo) {
      toast.error('You must be logged in to request an item.');
      return;
    }
    try {
      const userInfo = JSON.parse(decodeURIComponent(rawUserInfo));
      if (userInfo.userId === item.owner_id) {
        toast.error('You cannot request to buy your own item.');
        return;
      }
      const res = await fetch('http://localhost:3000/purchase-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          buyerId: userInfo.userId,
          sellerId: item.owner_id,
          quantity: selectedQuantity
        }),
      });
      if (res.ok) {
        toast.success('Request sent to seller!');
        setShowQuantityModal(false);
        setSelectedQuantity(1);
      } else {
        toast.error('Failed to send request.');
      }
    } catch (err) {
      toast.error('Error sending request.');
    }
  };

  const openQuantityModal = (item) => {
    setSelectedItemForRequest(item);
    setShowQuantityModal(true);
  };

  const closeQuantityModal = () => {
    setShowQuantityModal(false);
    setSelectedQuantity(1);
    setSelectedItemForRequest(null);
  };

  const renderSearchBar = () => (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-xl mt-6 sm:mt-10">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search items by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
        />
      </div>
      
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mt-4 flex items-center space-x-2 text-teal-600 hover:text-teal-700 text-sm sm:text-base"
      >
        <FiFilter />
        <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
      </button>

      {showFilters && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
            />
            <input
              type="text"
              name="condition"
              placeholder="Condition"
              value={filters.condition}
              onChange={handleFilterChange}
              className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
            />
            <input
              type="text"
              name="grade"
              placeholder="Grade"
              value={filters.grade}
              onChange={handleFilterChange}
              className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Price: Rs. {filters.maxPrice}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.maxPrice}
              onChange={handlePriceSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );

  if (selectedItem) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
              <button
                onClick={handleBackToList}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {selectedItem.images && selectedItem.images.length > 0 ? (
                  <img
                    src={selectedItem.images[0]}
                    alt={selectedItem.name}
                    className="h-48 sm:h-64 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 sm:h-64 w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedItem.name}</h1>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">Seller ID: {selectedItem.owner_id}</p>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-teal-600">Rs. {selectedItem.price}</div>
                </div>
                
                <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Category</p>
                    <p className="mt-1 text-base sm:text-lg text-gray-900">{selectedItem.category}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Condition</p>
                    <p className="mt-1 text-base sm:text-lg text-gray-900">{selectedItem.condition}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Grade</p>
                    <p className="mt-1 text-base sm:text-lg text-gray-900">{selectedItem.grade}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Subject</p>
                    <p className="mt-1 text-base sm:text-lg text-gray-900">{selectedItem.subject}</p>
                  </div>
                </div>
                
                <div className="mt-6 sm:mt-8">
                  <SellerRating sellerId={selectedItem.owner_id} />
                </div>
                
                <div className="mt-6 sm:mt-8">
                  {ownerId === selectedItem.owner_id ? (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-xl font-medium cursor-not-allowed"
                      title="You are the seller"
                    >
                      Request to Buy
                    </button>
                  ) : (
                    <button
                      onClick={() => openQuantityModal(selectedItem)}
                      className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200"
                    >
                      Request to Buy
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
              {selectedItem.reviews && selectedItem.reviews.length > 0 ? (
                <div className="space-y-4">
                  {selectedItem.reviews.map((review, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-600 font-medium">
                              {review.split(' ')[0][0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800">{review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No reviews yet. Be the first to review this item!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quantity Selection Modal - Moved inside selectedItem view */}
          {showQuantityModal && selectedItemForRequest && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Select Quantity for {selectedItemForRequest.name}</h3>
                <div className="flex items-center space-x-4 mb-6">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{selectedQuantity}</span>
                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeQuantityModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRequestToBuy(selectedItemForRequest)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                  >
                    Request to Buy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
          Welcome to EduShare
        </h1>
        <p className="mt-3 max-w-md mx-auto text-sm sm:text-base md:text-lg text-gray-500 sm:mt-5 md:max-w-3xl">
          Your one-stop platform for sharing educational resources. Buy, sell, and exchange textbooks, study materials, and academic supplies with fellow students.
        </p>
      </div>
      
      {renderSearchBar()}
      
      <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {getFilteredItems().map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-200"
          >
            <div className="relative">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-40 sm:h-48 object-cover"
                />
              ) : (
                <div className="h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                <span className="bg-teal-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  Rs. {item.price}
                </span>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Category:</span> {item.category}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Condition:</span> {item.condition}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Grade:</span> {item.grade}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Subject:</span> {item.subject}
                </p>
              </div>
              
              <div className="mt-3 sm:mt-4">
                <SellerRating sellerId={item.owner_id} />
              </div>
              
              <div className="mt-4 sm:mt-6 flex space-x-2 sm:space-x-4">
                <button
                  onClick={() => handleItemClick(item.id)}
                  className="flex-1 bg-teal-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 text-xs sm:text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
