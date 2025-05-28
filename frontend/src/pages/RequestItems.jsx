import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiGift, FiHeart, FiTag, FiBookOpen, FiCheck, FiLoader } from 'react-icons/fi';
import { FaDollarSign } from 'react-icons/fa';
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function RequestItems() {
  const [items, setItems] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [requestedItems, setRequestedItems] = useState({});
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetch("http://localhost:3000/items/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setItems(data.items);
        }
      })
      .catch((error) => {
        console.error("Error fetching items", error);
        toast.error("Error fetching items");
      });
  }, []);

  const handleRequest = (item) => {
    const rawUserInfo = getCookie('userInfo');
    if (rawUserInfo) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
        const isConfirmed = window.confirm(
          `Do you want to request "${item.name}" for donation from Seller?`
        );
        if (!isConfirmed) return;
        setRequestedItems((prev) => ({ ...prev, [item.id]: true }));
        const emailPayload = {
          sellerId: item.owner_id,
          subject: `Donation Request for ${item.name}`,
          text: `User ${parsed.username} (Email: ${parsed.usermail}) is requesting the donation of "${item.name}" priced at Rs. ${item.price}. Please contact them for further details.`,
        };
        fetch("http://localhost:3000/email/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              toast.success(`Request sent! Seller ${item.owner_id} will contact you soon.`);
              alert(`Your DONATION request for "${item.name}" has been sent to Seller. They will contact you shortly.`);
            } else {
              toast.error("Error sending request email.");
            }
          })
          .catch((error) => {
            console.error("Error sending email:", error);
            toast.error("An error occurred while sending the request email.");
          });
      } catch (error) {
        console.error('Error parsing userInfo cookie:', error);
      }
    }
    // toast.success(`User ${ownerId} has requested ${item.name} from Seller ${item.owner_id}`);
    // alert(`User ${ownerId} has requested "${item.name}" from Seller ${item.owner_id}. Seller ${item.owner_id} will contact you shortly for details.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full opacity-20 blur-2xl"></div>
          </div>
          <div className="relative">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center mb-4">
              <FiGift className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Request Items</h1>
            <p className="mt-2 text-gray-600">Browse and request items from our generous community</p>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.filter(item => item.available !== false).map((item) => (
            <div 
              key={item.id} 
              className="group bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <FiGift className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors duration-200">
                  {item.name}
                </h2>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <FiTag className="w-4 h-4 mr-2 text-teal-600" />
                    <span className="text-sm">{item.category}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCheck className="w-4 h-4 mr-2 text-teal-600" />
                    <span className="text-sm">{item.condition}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiBookOpen className="w-4 h-4 mr-2 text-teal-600" />
                    <span className="text-sm">Grade: {item.grade}</span>
                  </div>
                  <div className="flex items-center text-gray-900 font-semibold">
                    <FaDollarSign className="w-4 h-4 mr-2 text-teal-600" />
                    <span>₹ {item.price}</span>
                  </div>
                </div>

                {/* Request Button */}
                <button
                  onClick={() => handleRequest(item)}
                  disabled={requestedItems[item.id] || false}
                  className={`mt-6 w-full flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    requestedItems[item.id]
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700'
                  }`}
                >
                  {requestedItems[item.id] ? (
                    <>
                      <FiCheck className="w-5 h-5 mr-2" />
                      Requested
                    </>
                  ) : (
                    <>
                      <FiHeart className="w-5 h-5 mr-2" />
                      Request Item
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <FiLoader className="w-12 h-12 mx-auto text-teal-600 mb-4 animate-spin" />
            <p className="text-gray-600">Loading available items...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestItems;
