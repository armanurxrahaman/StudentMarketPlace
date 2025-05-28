const express = require("express");
const { db } = require("../config/firebase"); // Firestore instance

const { addItem, getAllItems, editItem } = require("../models/itemsModel");
const router = express.Router();
const {isAuthenticated} = require("../middlewares/authware.js");

// Route: Add a new item
router.post("/add", async (req, res) => {
  try {
    // Expect all required fields including the new 'name' attribute
    const { category, condition, grade, subject, name, owner_id, price, images, available } = req.body;
    
    // Validate required fields (reviews are not expected from the frontend)
    if (!category || !condition || !grade || !subject || !name || !owner_id || !price || !images) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const newItem = await addItem(category, condition, grade, subject, name, owner_id, price, images, available);
    return res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route: Get all items
router.get("/all", async (req, res) => {
  try {
    const items = await getAllItems();
    if (!items) {
      return res.status(404).json({ error: "No items found" });
    }
    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route: Get a single item by id
router.get("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    // Get the document from Firestore using the id
    const docRef = await db.collection("items").doc(itemId).get();
    if (!docRef.exists) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.status(200).json({ item: { id: docRef.id, ...docRef.data() } });
  } catch (error) {
    console.error("Error fetching item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route: Edit an item identified by its product name
router.put("/edit", async (req, res) => {
  try {
    // The 'name' field will identify the product.
    // Other fields are optional for updating.
    const { name, category, condition, grade, subject, owner_id, price, images } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Product name is required to identify the item" });
    }
    
    // Build an object with only the fields that are provided.
    const updatedData = {};
    if (category) updatedData.category = category;
    if (condition) updatedData.condition = condition;
    if (grade) updatedData.grade = grade;
    if (subject) updatedData.subject = subject;
    if (owner_id) updatedData.owner_id = Number(owner_id);
    if (price) updatedData.price = Number(price);
    if (images) updatedData.images = images;
    updatedData.available = true;
    const updatedItem = await editItem(name, updatedData);
    return res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error editing item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/add_comment", async (req, res) => {
  try {
    const { comments } = req.body;
    if (!comments || !Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({ error: "A non-empty array of comments is required" });
    }
    
    // Process each comment
    const results = await Promise.all(
      comments.map(async (commentObj) => {
        const { name, comment } = commentObj;
        if (!name || !comment) {
          return { name, error: "Missing name or comment" };
        }
        
        // Query for item with matching name
        const snapshot = await db.collection("items").where("name", "==", name).get();
        if (snapshot.empty) {
          return { name, error: "Item not found" };
        }
        
        // Update the first matching item by appending the comment
        const docRef = snapshot.docs[0].ref;
        const currentReviews = snapshot.docs[0].data().reviews || [];
        const updatedReviews = [...currentReviews, comment];
        await docRef.update({ reviews: updatedReviews });
        
        return { name, message: "Comment added" };
      })
    );
    
    return res.status(200).json({ results });
  } catch (error) {
    console.error("Error adding comments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// Route: Mark items as unavailable based on a list of item names
router.put("/make_unavailable", async (req, res) => {
  try {
    const { names } = req.body;
    if (!names || !Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ error: "A non-empty array of item names is required" });
    }

    const batch = db.batch();

    // For each name, query and update all matching items
    for (const name of names) {
      const snapshot = await db.collection("items").where("name", "==", name).get();
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          batch.update(doc.ref, { available: false });
        });
      }
    }

    await batch.commit();
    return res.status(200).json({ message: "Items updated successfully" });
  } catch (error) {
    console.error("Error updating items:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
