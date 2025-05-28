const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

console.log("Looking for Firebase key at:", serviceAccountPath);

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`❌ serviceAccountKey.json not found at: ${serviceAccountPath}`);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
