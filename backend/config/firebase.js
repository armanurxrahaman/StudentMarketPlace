const admin = require("firebase-admin");
const path = require('path');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "marketplace-38fdd.appspot.com"
});

const db = admin.firestore();
const storage = admin.storage();

module.exports = { admin, db, storage };
