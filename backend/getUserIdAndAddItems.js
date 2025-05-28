const db = require("./config/firebase");
const { addAllSampleItems } = require("./addSampleItems");

// Function to get user ID by username
async function getUserIdByUsername(username) {
  try {
    const snapshot = await db.collection("users").where("username", "==", username).get();
    
    if (snapshot.empty) {
      console.error(`User with username "${username}" not found`);
      return null;
    }
    
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    return userData.userId;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

// Main function
async function main() {
  try {
    // Get user ID for testuser
    const username = "testuser";
    const userId = await getUserIdByUsername(username);
    
    if (!userId) {
      console.error("Could not find user ID. Exiting.");
      process.exit(1);
    }
    
    console.log(`Found user ID for ${username}: ${userId}`);
    
    // Update the owner_id in the sample items
    const addItem = require("./models/itemsModel").addItem;
    
    // Sample items data with prices in INR
    const sampleItems = [
      {
        name: "Calculus: Early Transcendentals, 8th Edition",
        category: "Textbooks",
        condition: "Good",
        grade: "12",
        subject: "Mathematics",
        price: 2500,
        images: ["https://example.com/calculus.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Physics for Scientists and Engineers",
        category: "Textbooks",
        condition: "Like New",
        grade: "11",
        subject: "Physics",
        price: 1800,
        images: ["https://example.com/physics.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Organic Chemistry Textbook",
        category: "Textbooks",
        condition: "Fair",
        grade: "12",
        subject: "Chemistry",
        price: 1200,
        images: ["https://example.com/chemistry.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Scientific Calculator TI-84 Plus",
        category: "Electronics",
        condition: "Good",
        grade: "All",
        subject: "Mathematics",
        price: 3500,
        images: ["https://example.com/calculator.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Biology Lab Manual",
        category: "Lab Materials",
        condition: "New",
        grade: "11",
        subject: "Biology",
        price: 800,
        images: ["https://example.com/biology.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "World History: Patterns of Interaction",
        category: "Textbooks",
        condition: "Good",
        grade: "10",
        subject: "History",
        price: 1500,
        images: ["https://example.com/history.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "English Literature Anthology",
        category: "Textbooks",
        condition: "Fair",
        grade: "12",
        subject: "English",
        price: 900,
        images: ["https://example.com/english.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Geometry Set with Compass",
        category: "Stationery",
        condition: "New",
        grade: "All",
        subject: "Mathematics",
        price: 300,
        images: ["https://example.com/geometry.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Computer Science Principles",
        category: "Textbooks",
        condition: "Like New",
        grade: "11",
        subject: "Computer Science",
        price: 2000,
        images: ["https://example.com/computer.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Spanish Language Dictionary",
        category: "Reference",
        condition: "Good",
        grade: "All",
        subject: "Languages",
        price: 600,
        images: ["https://example.com/spanish.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Art Supplies Kit",
        category: "Art Supplies",
        condition: "New",
        grade: "All",
        subject: "Art",
        price: 1200,
        images: ["https://example.com/art.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Economics: Principles and Practices",
        category: "Textbooks",
        condition: "Good",
        grade: "12",
        subject: "Economics",
        price: 1800,
        images: ["https://example.com/economics.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Psychology Textbook",
        category: "Textbooks",
        condition: "Fair",
        grade: "12",
        subject: "Psychology",
        price: 1500,
        images: ["https://example.com/psychology.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Graphing Paper Notebook",
        category: "Stationery",
        condition: "New",
        grade: "All",
        subject: "Mathematics",
        price: 200,
        images: ["https://example.com/notebook.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "French Language Textbook",
        category: "Textbooks",
        condition: "Good",
        grade: "11",
        subject: "Languages",
        price: 1000,
        images: ["https://example.com/french.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Microscope Slides Set",
        category: "Lab Materials",
        condition: "New",
        grade: "All",
        subject: "Science",
        price: 800,
        images: ["https://example.com/microscope.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "SAT Math Prep Book",
        category: "Study Guides",
        condition: "Like New",
        grade: "12",
        subject: "Mathematics",
        price: 1200,
        images: ["https://example.com/sat.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Chemistry Lab Coat",
        category: "Lab Materials",
        condition: "Good",
        grade: "All",
        subject: "Science",
        price: 500,
        images: ["https://example.com/labcoat.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "World Atlas",
        category: "Reference",
        condition: "Good",
        grade: "All",
        subject: "Geography",
        price: 900,
        images: ["https://example.com/atlas.jpg"],
        owner_id: userId,
        available: true
      },
      {
        name: "Programming Python Textbook",
        category: "Textbooks",
        condition: "Like New",
        grade: "12",
        subject: "Computer Science",
        price: 2200,
        images: ["https://example.com/python.jpg"],
        owner_id: userId,
        available: true
      }
    ];
    
    // Function to add all sample items
    async function addAllSampleItems() {
      console.log("Starting to add sample items...");
      
      for (const item of sampleItems) {
        try {
          const { name, category, condition, grade, subject, price, images, owner_id, available } = item;
          const newItem = await addItem(category, condition, grade, subject, name, owner_id, price, images, available);
          console.log(`Added item: ${name}`);
        } catch (error) {
          console.error(`Error adding item ${item.name}:`, error);
        }
      }
      
      console.log("Finished adding sample items.");
    }
    
    // Add all sample items
    await addAllSampleItems();
    
    console.log("All items added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error in main process:", error);
    process.exit(1);
  }
}

// Run the main function
main(); 