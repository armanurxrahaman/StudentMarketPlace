const { db } = require("../config/firebase"); // Firestore instance
const express = require("express");
const router = express.Router();

// Reference the "ratings" collection in Firestore
const ratingsCollection = db.collection("ratings");

/**
 * GET /ratings/get
 * Expects a query parameter 'sellerId'
 * Returns the average rating for the seller (points / reviews)
 */
router.get("/get", async (req, res) => {
  try {
    const { sellerId } = req.query;
    if (!sellerId) {
      return res.status(400).json({ error: "Seller ID is required" });
    }
    const snapshot = await ratingsCollection.where("sellerId", "==", Number(sellerId)).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "Seller not found or no ratings available" });
    }
    // Assume one document per seller
    const ratingDoc = snapshot.docs[0];
    const data = ratingDoc.data();
    const average = data.reviews > 0 ? data.points / data.reviews : 0;
    return res.status(200).json({ averageRating: average });
  } catch (error) {
    console.error("Error fetching rating:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /ratings/add
 * Expects a JSON body with 'sellerId' and 'points'
 * If a rating document exists for that seller, it updates it;
 * otherwise, it creates a new one.
 */
router.post("/add", async (req, res) => {
  try {
    const { sellerId, points } = req.body;
    if (!sellerId || points === undefined) {
      return res.status(400).json({ error: "Seller ID and points are required" });
    }
    const snapshot = await ratingsCollection.where("sellerId", "==", sellerId).get();
    if (snapshot.empty) {
      // No document exists for this seller: create one
      const newRating = {
        sellerId,
        points: Number(points),
        reviews: 1,
      };
      const docRef = await ratingsCollection.add(newRating);
      return res.status(201).json({ message: "Rating created", rating: { id: docRef.id, ...newRating } });
    } else {
      // Document exists: update it
      const ratingDoc = snapshot.docs[0];
      const data = ratingDoc.data();
      const updatedPoints = Number(data.points) + Number(points);
      const updatedReviews = Number(data.reviews) + 1;
      await ratingDoc.ref.update({ points: updatedPoints, reviews: updatedReviews });
      return res.status(200).json({ message: "Rating updated", rating: { id: ratingDoc.id, sellerId, points: updatedPoints, reviews: updatedReviews } });
    }
  } catch (error) {
    console.error("Error updating rating:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
