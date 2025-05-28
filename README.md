# 🌟 Student Marketplace

A student-centric online marketplace inspired by platforms like Facebook Marketplace. This web application enables students to buy and sell used items, rate sellers, coordinate deliveries, and even request donations. Built with **Node.js**, **Express**, **React**, and **Firebase**, it offers a modern, feature-rich experience tailored for the student community.

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Firebase Integration](#-firebase-integration)
- [Map & Location Integration](#-map--location-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**Student Marketplace** is a dynamic platform where students can:

- 🛒 **Buy & Sell Used Items**
- ⭐ **Rate & Review Sellers**
- 📍 **Coordinate Deliveries with Map Links**
- 🏱 **Request or Offer Donations**
- 🔎 **Search & Filter with Precision**

---

## 🚀 Features

- 🔐 **Secure User Authentication**
- 🗃 **Item Listings Management**
- 🧠 **Advanced Search (Name, Category, Condition, Grade, Subject)**
- 🖼 **Image Upload & Detail View**
- ⭐ **Ratings & Reviews**
- 🛆 **Delivery & Location Integration**
- 🏱 **Donation Request System**
- 📱 **Fully Responsive Design**

---

## 🏧 Architecture

**Backend:**
- Node.js + Express
- Firebase Firestore & Storage
- Routes: Users & Items
- Middleware: Cookie sessions, Error handling

**Frontend:**
- React + React Router
- Tailwind CSS / CSS modules
- API calls using `fetch` or `axios`

---

## 🛠 Technology Stack

- **Frontend:** React, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database & Storage:** Firebase Firestore & Firebase Storage
- **Tools:** cookie-parser, react-hot-toast
- **External APIs:** OpenStreet API 

---

## ⚙ Installation & Setup

### ✅ Prerequisites

- Node.js (v14+)
- npm or yarn
- Firebase account

### 🔧 Backend Setup

```bash
cd backend
npm install
```

- Set up Firebase service account:
```js
// config/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
```

- Start backend:
```bash
npm start
```

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm start
```

- Runs on: `http://localhost:3000`

---

## 📖 Usage

- 🏠 **Home Page:** Search and filter items
- 🔍 **Click on Suggestions:** View item detail dynamically
- 👤 **Login/Register:** Manage your listings
- ✍️ **Rate & Review:** Build trust
- 🗌 **Delivery Help:** Share maps for easier meetups
- 🏱 **Donation Requests:** Ask or offer free items

---

## 🔌 API Endpoints

### 🛆 Item Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/items/add` | Add new item |
| `GET`  | `/items/all` | Fetch all items |
| `GET`  | `/items/:id` | Fetch item by ID |
| `PUT`  | `/items/edit` | Edit item by name |

### 👥 User Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/users/register` | Register a user |
| `POST` | `/users/login` | Login a user |
| `PUT`  | `/users/update` | Update user info |

---

## 🔥 Firebase Integration

- **Firestore** stores users and items
- **Storage** handles image uploads
- **Security** via Firebase rules

---

## 📍 Map & Location Integration

- Location links auto-generated
- Users can share these to plan deliveries
- Powered by Google Maps API or similar

---

## 🤝 Contributing

1. Fork this repo
2. Create a branch (`feature/your-feature`)
3. Commit your changes
4. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

Made with ❤️ for student entrepreneurs.

