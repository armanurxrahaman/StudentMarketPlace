import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { FiMessageSquare, FiSend, FiShoppingBag } from 'react-icons/fi';

function Comments() {
  const { cart, clearCart } = useCart();
  const [comments, setComments] = useState({});

  const handleChange = (itemName, value) => {
    setComments((prev) => ({
      ...prev,
      [itemName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      comments: cart
        .filter((item) => {
          const comment = comments[item.name];
          return comment && comment.trim() !== "";
        })
        .map((item) => ({
          name: item.name,
          comment: comments[item.name].trim(),
        })),
    };

    if (payload.comments.length === 0) {
      toast.error("Please enter at least one comment.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/items/add_comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Error adding comments");
      } else {
        toast.success("Comments added successfully!");
        clearCart();
      }
    } catch (error) {
      console.error("Error submitting comments:", error);
      toast.error("An error occurred while submitting comments");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center">
            <FiMessageSquare className="w-8 h-8 mr-3 text-teal-600" />
            Write Reviews for Your Purchases
          </h1>
          <p className="mt-2 text-gray-600">Share your experience with the items you purchased</p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FiShoppingBag className="w-16 h-16 mx-auto text-teal-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Items to Review</h2>
            <p className="text-gray-600">Your cart is empty. There are no items to review.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {cart.map((item) => (
              <div key={item.name} className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                    <p className="text-sm text-gray-600">
                      Price: ₹{item.price} | Quantity: {item.quantity} | Seller ID: {item.sellerId}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Write your review for this item..."
                    value={comments[item.name] || ""}
                    onChange={(e) => handleChange(item.name, e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none min-h-[100px]"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <FiSend className="w-5 h-5" />
                <span>Submit Reviews</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Comments;
