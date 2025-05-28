import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiMapPin, FiPackage, FiCreditCard } from 'react-icons/fi';
import MyRequests from './MyRequests';

// Helper to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Function to fetch the current user balance from backend
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

function Cart() {
  const { cart, removeItemFromCart, updateQuantity, clearCart } = useCart();
  const [orderMode, setOrderMode] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const navigate = useNavigate();

  // Calculate total price from cart items with proper number handling
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 0;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  const totalPrice = calculateTotal();

  // Format price to 2 decimal places
  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };

  // Handler to increment quantity
  const handleIncrement = (item) => {
    updateQuantity(item.name, item.sellerId, item.quantity + 1);
  };

  // Handler to decrement quantity (removes item if quantity becomes 0)
  const handleDecrement = async (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.name, item.sellerId, item.quantity - 1);
    } else {
      // If the item has a purchaseRequestId, update its ordered status
      if (item.purchaseRequestId) {
        try {
          await fetch(`http://localhost:3000/purchase-requests/${item.purchaseRequestId}/ordered`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ordered: false }),
          });
        } catch (error) {
          console.error('Error updating ordered status:', error);
          toast.error('Failed to update ordered status');
        }
      }
      removeItemFromCart(item);
      toast.info("Item removed from cart");
    }
  };

  // Also update the remove button click handler
  const handleRemoveItem = async (item) => {
    // If the item has a purchaseRequestId, update its ordered status
    if (item.purchaseRequestId) {
      try {
        await fetch(`http://localhost:3000/purchase-requests/${item.purchaseRequestId}/ordered`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordered: false }),
        });
      } catch (error) {
        console.error('Error updating ordered status:', error);
        toast.error('Failed to update ordered status');
      }
    }
    removeItemFromCart(item);
    toast.info("Item removed from cart");
  };

  // Handler for placing an order
  const handleOrder = async () => {
    if (!deliveryAddress) {
      toast.error("Please enter a delivery address.");
      return;
    }
  
    const rawUserInfo = getCookie("userInfo");
    if (!rawUserInfo) {
      toast.error("User not authenticated.");
      return;
    }
    const user = JSON.parse(decodeURIComponent(rawUserInfo));
  
    // Fetch the latest balance from the backend
    const currentBalance = await fetchBalance(user.userId);
    if (currentBalance < totalPrice) {
      toast.error("Insufficient balance to complete the order.");
      return;
    }
  
    try {
      const orderData = {
        delivery_address: deliveryAddress,
        items: cart.map((item) => ({
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          seller_id: item.sellerId
        })),
        total_price: totalPrice,
        user_id: String(user.userId)
      };
  
      const orderResponse = await fetch("http://localhost:3000/orders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData)
      });
      const orderResult = await orderResponse.json();
      if (!orderResponse.ok) {
        toast.error(orderResult.error || "Error placing order");
        return;
      }
  
      // Deduct the order total using the update balance endpoint.
      const balanceResponse = await fetch("http://localhost:3000/users/add_balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({  
          userId: user.userId,
          amount: -totalPrice 
        })
      });
      const balanceResult = await balanceResponse.json();
      if (!balanceResponse.ok) {
        toast.error(balanceResult.error || "Error updating balance");
        return;
      }

      // Increment the order total using the update balance endpoint.
      const sellerTotals = {};
      cart.forEach(item => {
        sellerTotals[item.sellerId] = (sellerTotals[item.sellerId] || 0) + (item.price * item.quantity);
      });

      // Update balance for each seller
      for (const sellerId in sellerTotals) {
        const sellerAmount = sellerTotals[sellerId];
        const balanceResponseSeller = await fetch("http://localhost:3000/users/inc_balance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            userId: sellerId,
            amount: Number(sellerAmount) 
          })
        });
        const balanceResultSeller = await balanceResponseSeller.json();
        if (!balanceResponseSeller.ok) {
          toast.error(balanceResultSeller.error || `Error updating balance for seller ${sellerId}`);
          return;
        }
      }
  
      // Mark all items in the cart as unavailable using the new route
      const names = cart.map(item => item.name);
      const unavailableResponse = await fetch("http://localhost:3000/items/make_unavailable", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names })
      });
      const unavailableResult = await unavailableResponse.json();
      if (!unavailableResponse.ok) {
        toast.error(unavailableResult.error || "Error marking items as unavailable");
        return;
      }
  
      toast.success("Order placed successfully!");
      setOrderMode(false);
      setDeliveryAddress("");
      
      // Navigate to comments page immediately after successful order
      navigate("/comments");
      
    } catch (error) {
      console.error("Order error:", error);
      toast.error("An error occurred while placing the order.");
    }
  };
  
  // Handler for clearing the cart
  const handleClearCart = async () => {
    // Update ordered status to false for all items with purchaseRequestId
    const updatePromises = cart
      .filter(item => item.purchaseRequestId)
      .map(item => 
        fetch(`http://localhost:3000/purchase-requests/${item.purchaseRequestId}/ordered`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordered: false }),
        })
      );

    try {
      await Promise.all(updatePromises);
      clearCart();
      toast.success("Cart cleared successfully!");
    } catch (error) {
      console.error('Error updating ordered status:', error);
      toast.error('Failed to update some items');
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <FiShoppingCart className="w-16 h-16 mx-auto text-teal-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Start adding items to your cart to see them here.</p>
            <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 transition-all duration-200">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center">
            <FiShoppingCart className="w-8 h-8 mr-3 text-teal-600" />
            Your Shopping Cart
          </h1>
          <p className="mt-2 text-gray-600">Review and manage your selected items</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h2>
                      <p className="text-sm text-gray-600 mb-1">Seller ID: {item.sellerId}</p>
                      <p className="text-lg font-medium text-teal-600">₹ {formatPrice(item.price)}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item)}
                      className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                      <button 
                        onClick={() => handleDecrement(item)}
                        className="p-1 hover:bg-gray-200 rounded-md transition-colors duration-200"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => handleIncrement(item)}
                        className="p-1 hover:bg-gray-200 rounded-md transition-colors duration-200"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">Total: ₹ {formatPrice(itemTotal)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiPackage className="w-5 h-5 mr-2 text-teal-600" />
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-lg font-medium">₹ {formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-teal-600">₹ {formatPrice(totalPrice)}</span>
                </div>
                <button 
                  onClick={() => setOrderMode((prev) => !prev)}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                  disabled={totalPrice <= 0}
                >
                  <FiCreditCard className="w-5 h-5 mr-2" />
                  {orderMode ? "Cancel Order" : "Proceed to Checkout"}
                </button>
                <button 
                  onClick={handleClearCart}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center mt-2"
                >
                  <FiTrash2 className="w-5 h-5 mr-2" />
                  Clear Cart
                </button>
              </div>
            </div>

      {orderMode && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FiMapPin className="w-5 h-5 mr-2 text-teal-600" />
                  Delivery Details
                </h2>
                <div className="space-y-4">
                  <div>
          <input
            type="text"
            placeholder="Paste link of Delivery Address here"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <a 
                    href="/delivery" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 text-center flex items-center justify-center"
                  >
                    <FiMapPin className="w-5 h-5 mr-2" />
            Open Delivery Map
          </a>
                  <button 
                    onClick={handleOrder}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                    disabled={!deliveryAddress || totalPrice <= 0}
                  >
                    <FiPackage className="w-5 h-5 mr-2" />
                    Place Order
          </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
