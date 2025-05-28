const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchItems = async () => {
  const response = await fetch(`${API_URL}/items/all`);
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
};

export const fetchItemById = async (id) => {
  const response = await fetch(`${API_URL}/items/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch item');
  }
  return response.json();
};

export const addItem = async (itemData) => {
  const response = await fetch(`${API_URL}/items/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemData),
  });
  if (!response.ok) {
    throw new Error('Failed to add item');
  }
  return response.json();
};

export const editItem = async (itemData) => {
  const response = await fetch(`${API_URL}/items/edit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemData),
  });
  if (!response.ok) {
    throw new Error('Failed to edit item');
  }
  return response.json();
};

export const fetchSellerRating = async (sellerId) => {
  const response = await fetch(`${API_URL}/ratings/get?sellerId=${sellerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch seller rating');
  }
  return response.json();
};

export const createPurchaseRequest = async (requestData) => {
  const response = await fetch(`${API_URL}/purchase-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    throw new Error('Failed to create purchase request');
  }
  return response.json();
}; 