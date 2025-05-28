// routes/cart.routes.js
const express = require("express");
const router = express.Router();
const { usersCollection } = require("../models/userModel");
const { itemsCollection } = require("../models/itemsModel");

// GET /cart
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    
    const userDoc = await usersCollection.doc(userId.toString()).get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "User not found" });
    
    const userData = userDoc.data();
    const cartItems = userData.cartItems || [];
    const productIds = cartItems.map((item) => item.id);
    
    if (productIds.length === 0) {
      return res.json([]); // Empty cart.
    }
    
    // Firestore "in" queries are limited to 10 elements.
    const productsSnapshot = await itemsCollection
      .where(require("firebase-admin").firestore.FieldPath.documentId(), "in", productIds)
      .get();
    
    const products = [];
    productsSnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    // Merge product data with quantity from the user's cart.
    const result = products.map((prod) => {
      const cartItem = cartItems.find((item) => item.id.toString() === prod.id);
      return { ...prod, quantity: cartItem ? cartItem.quantity : 0 };
    });
    
    return res.json(result);
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /cart/add
router.post("/add", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId)
      return res.status(400).json({ error: "userId and productId are required" });
    
    const userRef = usersCollection.doc(userId.toString());
    const userDoc = await userRef.get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "User not found" });
    
    let cartItems = userDoc.data().cartItems || [];
    const existingIndex = cartItems.findIndex(
      (item) => item.id.toString() === productId
    );
    if (existingIndex >= 0) {
      cartItems[existingIndex].quantity += 1;
    } else {
      cartItems.push({ id: productId, quantity: 1 });
    }
    
    await userRef.update({ cartItems });
    return res.json(cartItems);
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// PUT /cart/update/:id
router.put("/update/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { userId, quantity } = req.body;
    if (!userId || quantity === undefined)
      return res.status(400).json({ error: "userId and quantity are required" });
    
    const userRef = usersCollection.doc(userId.toString());
    const userDoc = await userRef.get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "User not found" });
    
    let cartItems = userDoc.data().cartItems || [];
    const index = cartItems.findIndex(
      (item) => item.id.toString() === productId
    );
    if (index === -1)
      return res.status(404).json({ error: "Product not found in cart" });
    
    if (quantity === 0) {
      cartItems.splice(index, 1);
    } else {
      cartItems[index].quantity = quantity;
    }
    
    await userRef.update({ cartItems });
    return res.json(cartItems);
  } catch (error) {
    console.error("Error updating cart:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /cart/remove
router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId)
      return res.status(400).json({ error: "userId is required" });
    
    const userRef = usersCollection.doc(userId.toString());
    const userDoc = await userRef.get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "User not found" });
    
    let cartItems = userDoc.data().cartItems || [];
    if (!productId) {
      cartItems = [];
    } else {
      cartItems = cartItems.filter(
        (item) => item.id.toString() !== productId
      );
    }
    
    await userRef.update({ cartItems });
    return res.json(cartItems);
  } catch (error) {
    console.error("Error removing from cart:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
