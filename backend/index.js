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
  'http://localhost:5173',
  'http://localhost:3000',
  'https://studentmarketplace-frontend.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
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
