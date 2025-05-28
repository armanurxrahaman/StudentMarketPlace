require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/items");
const orderRoutes = require("./routes/orders");
const emailRoutes = require("./routes/email");
const ratingRoutes = require("./routes/ratings");
const purchaseRequestsRoutes = require('./routes/purchaseRequests');
const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/orders", orderRoutes);
app.use("/email", emailRoutes);
app.use("/ratings",ratingRoutes);
app.use('/purchase-requests', purchaseRequestsRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
