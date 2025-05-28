const express = require('express');
const {
  addPurchaseRequest,
  getRequestsByBuyer,
  getRequestsBySeller,
  updateRequestStatus,
  updateRequestOrderedStatus,
} = require('../models/purchaseRequestsModel');

const router = express.Router();

// Create a new purchase request
router.post('/', async (req, res) => {
  try {
    const { itemId, buyerId, sellerId, quantity } = req.body;
    console.log('Received purchase request:', { itemId, buyerId, sellerId, quantity });
    if (!itemId || !buyerId || !sellerId || !quantity) {
      return res.status(400).json({ error: 'itemId, buyerId, sellerId, and quantity are required' });
    }
    const request = await addPurchaseRequest(itemId, buyerId, sellerId, quantity);
    res.status(201).json({ request });
  } catch (err) {
    console.error('Error in /purchase-requests:', err);
    res.status(500).json({ error: err.message || 'Failed to create purchase request' });
  }
});

// Get all requests by buyer
router.get('/buyer/:buyerId', async (req, res) => {
  try {
    const { buyerId } = req.params;
    const requests = await getRequestsByBuyer(buyerId);
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get buyer requests' });
  }
});

// Get all requests for a seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const requests = await getRequestsBySeller(sellerId);
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get seller requests' });
  }
});

// Update request status (accept/reject)
router.patch('/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = await updateRequestStatus(requestId, status);
    res.json({ request: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update request status' });
  }
});

// Update request ordered status
router.patch('/:requestId/ordered', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { ordered } = req.body;
    if (typeof ordered !== 'boolean') {
      return res.status(400).json({ error: 'ordered must be a boolean' });
    }
    const updated = await updateRequestOrderedStatus(requestId, ordered);
    res.json({ request: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update request ordered status' });
  }
});

module.exports = router; 