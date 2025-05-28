# Student Marketplace

A full-stack e-commerce platform designed specifically for students to buy and sell items within their campus community.

## Live Demo
[View Live Application](https://student-marketplace.vercel.app)

## Features

### For Buyers
- Browse items with detailed descriptions and images
- Request to purchase items with quantity selection
- Track purchase requests status
- Add accepted requests to cart
- Secure checkout process
- Balance management
- Order history

### For Sellers
- List items with images and descriptions
- Manage purchase requests
- Track sales and earnings
- Update item availability
- View order history

### Technical Features
- Real-time updates
- Secure authentication
- Responsive design
- Cart management
- Purchase request system
- Balance tracking
- Order processing

## Tech Stack

### Frontend
- React.js
- Context API for state management
- React Router for navigation
- Tailwind CSS for styling
- React Icons for UI elements
- React Hot Toast for notifications

### Backend
- Node.js
- Express.js
- Firebase Authentication
- Firebase Firestore
- CORS enabled
- Cookie-based session management

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Firebase

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```
3. Set up environment variables
4. Start the development servers:
   ```bash
   # Start backend
   cd backend
   npm start

   # Start frontend
   cd frontend
   npm start
   ```

## Project Structure
```
student-marketplace/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/     # Page components
│   │   ├── context/   # Context providers
│   │   └── App.js     # Main app component
│   └── public/        # Static files
└── backend/           # Node.js backend
    ├── routes/        # API routes
    ├── models/        # Database models
    └── index.js       # Server entry point
```

## Future Enhancements
- Real-time chat between buyers and sellers
- Rating and review system
- Advanced search and filtering
- Push notifications
- Mobile app version

## Contact
[Your Name] - [Your Email]
Project Link: [GitHub Repository URL]

