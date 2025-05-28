import React, { useEffect, useState } from 'react';

export default function SellerRequests() {
  const [requests, setRequests] = useState([]);
  const [itemNames, setItemNames] = useState({});
  const sellerId = String(localStorage.getItem('userId') || '');

  useEffect(() => {
    if (!sellerId) return;
    fetch(`http://localhost:3000/purchase-requests/seller/${sellerId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched requests for seller:', data.requests);
        setRequests(data.requests || []);
        // Fetch item names for all requests
        data.requests?.forEach(req => {
          if (req.itemId && !itemNames[req.itemId]) {
            fetch(`http://localhost:3000/items/${req.itemId}`)
              .then(res => res.json())
              .then(itemData => {
                setItemNames(prev => ({
                  ...prev,
                  [req.itemId]: itemData.item?.name || req.itemId
                }));
              });
          }
        });
      });
  }, [sellerId]);

  const handleAction = async (id, status) => {
    await fetch(`http://localhost:3000/purchase-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Incoming Purchase Requests</h2>
      <ul>
        {requests.map(req => (
          <li key={req.id} className="mb-2 p-2 border rounded">
            Item: {itemNames[req.itemId] || req.itemId} | Buyer: {req.buyerId} | Quantity: {req.quantity} | Status: <b>{req.status}</b>
            {req.status === 'pending' && (
              <>
                <button onClick={() => handleAction(req.id, 'accepted')} className="ml-2 btn-primary">Accept</button>
                <button onClick={() => handleAction(req.id, 'rejected')} className="ml-2 btn-secondary">Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 