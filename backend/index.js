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

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://student-marketplace.vercel.app',
  'https://studentmarketplace-frontend.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Student Marketplace API is running' });
});

// Routes
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/orders", orderRoutes);
app.use("/email", emailRoutes);
app.use("/ratings", ratingRoutes);
app.use("/purchase-requests", purchaseRequestsRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
