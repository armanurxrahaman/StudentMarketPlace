const express = require("express");
const router = express.Router();
const { addUser, getUserByEmail, getUserById, updateUser, deleteUser, getAllUsers, getUserEmailById } = require("../models/userModel");
const { db } = require("../config/firebase"); // Firestore instance

// Route: Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, usermail, password } = req.body;
    
    // Validate required fields
    if (!username || !usermail || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new user
    const newUser = await addUser(username, usermail, password);
    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route: Login a user using username and password
router.post("/login", async (req, res) => {
  return loginUserByUsername(req, res);
});

// Route: Update user info (email, password, and optionally about)
router.put("/update", async (req, res) => {
  try {
    const { email, password, about } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Retrieve user info from cookie
    const rawUserInfo = req.cookies.userInfo;
    if (!rawUserInfo) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const user = JSON.parse(rawUserInfo);
    const userId = user.userId;

    // Update user document
    const updatedUser = await updateUser(userId, email, password, about);
    return res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Route: POST /users/add_balance
 * Expects a JSON body with { userId, amount }.
 * Adds the specified amount to the user's current balance.
 */
router.post("/add_balance", async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount == null) {
      return res.status(400).json({ error: "Amount is required" });
    }
    
    // Retrieve user info from cookie instead of expecting userId in the request body
    const rawUserInfo = req.cookies.userInfo;
    if (!rawUserInfo) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const user = JSON.parse(rawUserInfo);
    const userId = user.userId;
    
    const usersCollection = db.collection("users");
    // Query the user document by userId (assuming userId is stored as a number)
    const snapshot = await usersCollection.where("userId", "==", Number(userId)).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }
    const userDoc = snapshot.docs[0];
    const currentBalance = userDoc.data().balance || 0;
    const newBalance = currentBalance + Number(amount);
    await userDoc.ref.update({ balance: newBalance });
    return res.status(200).json({ message: "Balance updated successfully", balance: newBalance });
  } catch (error) {
    console.error("Error updating balance:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// New Route: Get balance for a given user ID (sent in the request body)
router.get("/get_bal", async (req, res) => {
  try {
    const { userId } = req.query;
    // console.log(typeof(user));
    if (!userId) {
      return res.status(400).json({ error: "User ID is required in the request body" });
    }
    const usersCollection = db.collection("users");
    const snapshot = await usersCollection.where("userId", "==", Number(userId)).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }
    const userDoc = snapshot.docs[0];
    const balance = userDoc.data().balance;
    return res.status(200).json({ balance });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/donation", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required in the request body" });
    }
    updateUserFlag(userId);
    return res.status(200).json({ message: "User is eligible for donation request" });
  } catch (error) {
    console.error("Error setting donation status", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/inc_balance", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (amount == null) {
      return res.status(400).json({ error: "Amount is required" });
    }
    
    const usersCollection = db.collection("users");
    // Query the user document by userId (assuming userId is stored as a number)
    const snapshot = await usersCollection.where("userId", "==", Number(userId)).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }
    const userDoc = snapshot.docs[0];
    const currentBalance = userDoc.data().balance || 0;
    const newBalance = currentBalance + Number(amount);
    await userDoc.ref.update({ balance: newBalance });
    return res.status(200).json({ message: "Balance updated successfully", balance: newBalance });
  } catch (error) {
    console.error("Error updating balance:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

