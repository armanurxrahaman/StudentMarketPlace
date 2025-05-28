const express = require("express");
const { db } = require("../config/firebase"); // Firestore instance
const { addItem, getAllItems, editItem } = require("../models/itemsModel"); // Not used here, but for reference
const { sendEmail, sendHtmlEmail } = require("../utils/emailService");
const { getUserEmailById } = require("../models/userModel");
const router = express.Router();

// Reference the "orders" collection in Firestore
const ordersCollection = db.collection("orders");

// Function to get the next auto-incremented order_id
const getNextOrderId = async () => {
  const snapshot = await ordersCollection.orderBy("order_id", "desc").limit(1).get();
  if (snapshot.empty) {
    return 1; // Start order_id from 1 if no orders exist
  }
  return snapshot.docs[0].data().order_id + 1;
};

/**
 * Route: POST /orders/add
 * Adds a new order to the "orders" collection.
 */
router.post("/add", async (req, res) => {
  try {
    const { delivery_address, items, total_price, user_id } = req.body;
    // Validate required fields
    if (!items || !total_price || !user_id) {
      return res.status(400).json({ error: "Items, total_price, and user_id are required" });
    }
    
    // Get next order_id (auto-increment)
    const order_id = await getNextOrderId();
    
    // Create new order document
    const newOrder = {
      delivery_address: delivery_address || "", // delivery address can be null or empty
      items, // Expect items to be an array of objects: { item_name, price, quantity, seller_id }
      order_id,
      total_price: Number(total_price),
      user_id, // Stored as string
    };

    const docRef = await ordersCollection.add(newOrder);

    // Group items by seller_id
    const sellerItemsMap = {};
    newOrder.items.forEach(item => {
      if (!sellerItemsMap[item.seller_id]) {
        sellerItemsMap[item.seller_id] = [];
      }
      sellerItemsMap[item.seller_id].push(item);
    });
    // console.log(user_id);
    const buyerEmail = await getUserEmailById(user_id);

    // Send email to each seller with their respective order items
    for (const sellerId in sellerItemsMap) {
      // console.log(sellerId);
      const sellerEmail = await getUserEmailById(sellerId);
      if (sellerEmail) {
        const itemDetails = sellerItemsMap[sellerId].map(item => 
          `${item.item_name} (Quantity: ${item.quantity}, Price: ${item.price})`
        ).join("\n");
        const emailSubject = `New Order Received - Order #${order_id}`;
        const emailContent = `
Dear Seller,

A new order has been placed that includes the following items for you:

${itemDetails}

Buyer Email: ${buyerEmail}
Delivery Address: ${newOrder.delivery_address}

Please process this order promptly.

Best regards,
Marketplace Team
        `;
        await sendEmail(sellerEmail, emailSubject, emailContent);
      }
    }

    // Send order confirmation email to the buyer
    if (buyerEmail) {
      // Prepare a summary of the order for the buyer
      const allItemDetails = newOrder.items.map(item =>
        `${item.item_name} (Quantity: ${item.quantity}, Price: ${item.price})`
      ).join("\n");
      const buyerSubject = `Order Confirmation - Order #${order_id}`;
      const buyerContent = `
Dear Customer,

Thank you for your order. Your order has been received successfully with the following details:

Order ID: ${order_id}
Delivery Address: ${newOrder.delivery_address}
Total Price: ${newOrder.total_price}

Items Ordered:
${allItemDetails}

We will notify you once your order is shipped.

Best regards,
Marketplace Team
      `;
      await sendEmail(buyerEmail, buyerSubject, buyerContent);
    }

    return res.status(201).json({ message: "Order added successfully", order: { id: docRef.id, ...newOrder } });
  } catch (error) {
    console.error("Error adding order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Route: GET /orders/get
 * Retrieves all orders for a given user_id.
 * Expects a query parameter `user_id`.
 */
router.get("/get", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const snapshot = await ordersCollection.where("user_id", "==", user_id).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "No orders found for this user" });
    }
    
    let orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Route: GET /orders/find
 * Finds orders where a given seller_id appears in any of the items.
 * Expects a query parameter `seller_id`.
 * Returns an array with order_id and matching items (item_name and quantity).
 */
router.get("/find", async (req, res) => {
  try {
    const { seller_id } = req.query;
    if (!seller_id) {
      return res.status(400).json({ error: "Seller ID is required" });
    }
    
    const snapshot = await ordersCollection.get();
    let result = [];
    snapshot.forEach(doc => {
      const order = doc.data();
      // Assuming order.items is an array of objects
      const matchingItems = order.items.filter(item => item.seller_id === seller_id)
        .map(item => ({ item_name: item.item_name, quantity: item.quantity }));
      if (matchingItems.length > 0) {
        result.push({ order_id: order.order_id, items: matchingItems });
      }
    });
    
    if (result.length === 0) {
      return res.status(404).json({ error: "No orders found for this seller" });
    }
    return res.status(200).json({ orders: result });
  } catch (error) {
    console.error("Error finding orders for seller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
