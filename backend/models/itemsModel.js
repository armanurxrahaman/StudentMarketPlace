const { db } = require("../config/firebase");

// Reference the "items" collection in Firestore
const itemsCollection = db.collection("items");

// Function to add a new item
// The reviews field is left as an empty array.
const addItem = async (category, condition, grade, subject, name, owner_id, price, images, available) => {
  const newItem = {
    category,                     // string
    condition,                    // string
    grade,                        // string
    subject,                      // string
    name,                         // product name
    owner_id: Number(owner_id),   // number
    price: Number(price),         // number
    images,                       // array of strings (URLs)
    reviews: [],                  // initialize reviews as an empty array
    available                   // boolean: indicates if the item is available
  };

  // Add a new document to the items collection
  const docRef = await itemsCollection.add(newItem);
  return { id: docRef.id, ...newItem };
};


const getAllItems = async () => {
  const snapshot = await itemsCollection.get();
  const items = [];
  snapshot.forEach(doc => {
    items.push({ id: doc.id, ...doc.data() });
  });
  return items;
};

// Function to edit an item using its 'name' as an identifier.
// It updates the fields provided in updatedData.
const editItem = async (name, updatedData) => {
  // Query the collection for an item with the matching name.
  const querySnapshot = await itemsCollection.where("name", "==", name).get();
  if (querySnapshot.empty) {
    throw new Error("Item not found");
  }
  // Update the first document found.
  const docRef = querySnapshot.docs[0].ref;
  await docRef.update(updatedData);
  // Retrieve and return the updated document.
  const updatedDoc = await docRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};


module.exports = { addItem, getAllItems, editItem, itemsCollection: db.collection("items") };