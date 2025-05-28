const { addUser } = require("./models/userModel");

async function createTestUser() {
  try {
    const username = "testuser";
    const usermail = "testuser@example.com";
    const password = "testpassword123";

    console.log("Creating test user...");
    const newUser = await addUser(username, usermail, password);
    console.log("Test user created successfully:", newUser);
  } catch (error) {
    console.error("Error creating test user:", error);
  }
}

createTestUser(); 