const bcrypt = require("bcryptjs");
const db = require("../config/firebase");

const usersCollection = db.collection("users");

// Function to get the next auto-incremented userId
const getNextUserId = async () => {
  const snapshot = await usersCollection.orderBy("userId", "desc").limit(1).get();
  if (snapshot.empty) {
    return 1; // Start userId from 1 if no users exist
  }
  return snapshot.docs[0].data().userId + 1;
};

// Function to add a new user with hashed password
const addUser = async (username, usermail, password) => {
  const userId = await getNextUserId();
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt factor of 10

  const newUser = {
    userId,
    username,
    usermail,
    password: hashedPassword, // Store the hashed password
    balance: 100, // Default balance
  };

  await usersCollection.add(newUser);
  return newUser;
};

// Function to log in a user by username
const loginUserByUsername = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Query Firestore for the user
    const snapshot = await usersCollection.where("username", "==", username).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user data
    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Compare the provided password with the hashed password stored in Firestore
    let isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      isPasswordValid = (user.password === password);
    }
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Remove password before storing in cookie
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    // Set cookie with user info
    res.cookie("userInfo", JSON.stringify(userWithoutPassword), { httpOnly: false });

    return res.status(200).json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update a user's email, password (hashed), and optionally about field
// const updateUser = async (userId, email, password, about) => {
//   const userRef = usersCollection.doc(userId.toString());

//   const updateData = { usermail: email };

//   // Hash the new password before storing it
//   if (password) {
//     updateData.password = await bcrypt.hash(password, 10);
//   }

//   // Optionally update the about field if provided
//   if (about !== undefined) {
//     updateData.about = about;
//   }

//   await userRef.update(updateData);
//   const updatedDoc = await userRef.get();
//   return updatedDoc.data();
// };

const updateUser = async (userId, email, password, about) => {
  // Query the collection for the document with matching userId field
  const snapshot = await usersCollection.where("userId", "==", userId).get();
  if (snapshot.empty) {
    throw new Error("User not found");
  }
  const userDoc = snapshot.docs[0];
  
  const updateData = { usermail: email };

  // Hash the new password if provided
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  // Optionally update the about field if provided
  if (about !== undefined) {
    updateData.about = about;
  }

  // Update the document using the found reference
  await userDoc.ref.update(updateData);
  const updatedDoc = await userDoc.ref.get();
  return updatedDoc.data();
};


// Function to get the email for a given userId
const getUserEmailById = async (userId) => {
  const snapshot = await usersCollection.where("userId", "==", Number(userId)).get();
  if (snapshot.empty) {
    throw new Error("User not found");
  }

  const userDoc = snapshot.docs[0];
  return userDoc.data().usermail;
};

// Function to provide donation status
const updateUserFlag = async (userId) => {
  const snapshot = await usersCollection.where("userId", "==", Number(userId)).get();
  if (snapshot.empty) {
    throw new Error("User not found");
  }
  const userDoc = snapshot.docs[0];

  await userDoc.ref.update({ flag: true });
  
  const updatedDoc = await userDoc.ref.get();
  return updatedDoc.data();
};


module.exports = { addUser, loginUserByUsername, updateUser, getUserEmailById, updateUserFlag, usersCollection };
