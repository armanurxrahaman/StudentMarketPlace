const { db } = require("../config/firebase");
const purchaseRequestsCollection = db.collection("purchaseRequests");

// Add a new purchase request
async function addPurchaseRequest(itemId, buyerId, sellerId, quantity) {
  const newRequest = {
    itemId,
    buyerId,
    sellerId,
    quantity,
    ordered: false,
    status: 'pending',
    timestamp: Date.now(),
  };
  const docRef = await purchaseRequestsCollection.add(newRequest);
  return { id: docRef.id, ...newRequest };
}

// Get all requests by buyer
async function getRequestsByBuyer(buyerId) {
  const snapshot = await purchaseRequestsCollection.where('buyerId', '==', Number(buyerId)).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get all requests for a seller
async function getRequestsBySeller(sellerId) {
  const snapshot = await purchaseRequestsCollection.where('sellerId', '==', Number(sellerId)).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Update request status
async function updateRequestStatus(requestId, status) {
  await purchaseRequestsCollection.doc(requestId).update({ status });
  const doc = await purchaseRequestsCollection.doc(requestId).get();
  return { id: doc.id, ...doc.data() };
}

// Update request ordered status
async function updateRequestOrderedStatus(requestId, ordered) {
  await purchaseRequestsCollection.doc(requestId).update({ ordered });
  const doc = await purchaseRequestsCollection.doc(requestId).get();
  return { id: doc.id, ...doc.data() };
}

module.exports = {
  addPurchaseRequest,
  getRequestsByBuyer,
  getRequestsBySeller,
  updateRequestStatus,
  updateRequestOrderedStatus,
}; 