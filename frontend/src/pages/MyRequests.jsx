import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [itemNames, setItemNames] = useState({});
  const [itemDetails, setItemDetails] = useState({});
  const buyerId = String(localStorage.getItem('userId') || '');
  const { addItemToCart, removeItemFromCart } = useCart();

  useEffect(() => {
    if (!buyerId) return;
    fetch(`http://localhost:3000/purchase-requests/buyer/${buyerId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched requests for buyer:', data.requests);
        setRequests(data.requests || []);
        // Fetch item names and details for all requests
        data.requests?.forEach(req => {
          if (req.itemId && !itemNames[req.itemId]) {
            fetch(`http://localhost:3000/items/${req.itemId}`)
              .then(res => res.json())
              .then(itemData => {
                setItemNames(prev => ({
                  ...prev,
                  [req.itemId]: itemData.item?.name || req.itemId
                }));
                setItemDetails(prev => ({
                  ...prev,
                  [req.itemId]: itemData.item
                }));
              });
          }
        });
      });
  }, [buyerId]);

  const updateRequestOrderedStatus = async (requestId, ordered) => {
    try {
      const response = await fetch(`http://localhost:3000/purchase-requests/${requestId}/ordered`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordered }),
      });
      if (!response.ok) throw new Error('Failed to update ordered status');
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, ordered } : req
        )
      );
    } catch (error) {
      console.error('Error updating ordered status:', error);
      toast.error('Failed to update ordered status');
    }
  };

  const handleAddToCart = async (itemId, quantity, requestId) => {
    if (!buyerId) {
      toast.error('Please log in to add items to cart');
      return;
    }

    const item = itemDetails[itemId];
    if (item) {
      // Only add to cart if the item belongs to the current user's accepted request
      const request = requests.find(req => req.itemId === itemId && req.status === 'accepted');
      if (!request) {
        toast.error('This item is not available for your cart');
        return;
      }

      // Update ordered status to true
      await updateRequestOrderedStatus(requestId, true);

      addItemToCart({
        name: item.name,
        price: item.price,
        quantity: request.quantity,
        sellerId: item.owner_id,
        buyerId: buyerId,
        purchaseRequestId: requestId,
        ordered: true
      });
      toast.success('Item added to cart!');
    }
  };

  const handleRemoveFromCart = async (item) => {
    if (item.purchaseRequestId) {
      // Update ordered status to false
      await updateRequestOrderedStatus(item.purchaseRequestId, false);
    }
    removeItemFromCart(item);
    toast.success('Item removed from cart!');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Purchase Requests</h2>
      <ul>
        {requests.map(req => (
          <li key={req.id} className="mb-2 p-2 border rounded">
            Item: {itemNames[req.itemId] || req.itemId} | Quantity: {req.quantity} | Status: <b>{req.status}</b>
            {req.status === 'accepted' && (
              <button 
                onClick={() => handleAddToCart(req.itemId, req.quantity, req.id)}
                disabled={req.ordered}
                className={`ml-2 px-3 py-1 rounded transition-colors ${
                  req.ordered 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {req.ordered ? 'In Cart' : 'Add to Cart'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 