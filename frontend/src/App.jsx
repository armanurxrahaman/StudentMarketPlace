import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AddItem from './components/addItem.jsx';
import EditItem from './pages/Edit.jsx';
import Profile from './pages/Profile.jsx';
import Cart from './pages/Cart.jsx';
import { CartProvider } from './context/CartContext';
import Delivery from './pages/Delivery.jsx';
import Comments from './pages/Comments.jsx';
import RequestItems from './pages/RequestItems.jsx';
import MyRequests from './pages/MyRequests';
import SellerRequests from './pages/SellerRequests';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-purple-50">
          <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
          <Routes>
              <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/edit" element={<EditItem />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/request" element={<RequestItems />} />
              <Route path="/my-requests" element={<MyRequests />} />
              <Route path="/seller-requests" element={<SellerRequests />} />
          </Routes>
          </div>
        </main>
        <Toaster />
        </div>
    </CartProvider>
  );
}

export default App;
