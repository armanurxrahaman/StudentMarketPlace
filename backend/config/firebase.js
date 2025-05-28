const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "studentapp-61a45",
  private_key_id: "dd379db88cfeee8b9541d94ae593c152eb422d6e",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPnyaht70y5NoJ\nZuHcH+2zNCRMYxkHb22nSIj04foJWe67iOQPij4lwQGD2NgS9CVEYnEhP+dv8uBw\nkG9+kwAygNcojQZ2Q3Y8+bcmUwJKnl8T9VDXNIr4eN3rLcP5GKKqPdjHqcncwkmp\nsUwWhcCF+Hx3oxWBQ78OerB12LNojsXDfKu6/mjCaYnRQJntCUyYcaDwalCDfwdN\n/9B+f6oPz920oGdTQ0fpNc/UrMn7rfvUcg7V9uyBYEVSvGOLjxlpdry8ChDaAYIN\ne93Of4b/VtFpmnjNauM0x7fV3UAhLN411EaYZx/iXQqoNKNVeMK1e87aj1Heuqi2\niMty5C6hAgMBAAECggEAAOOw5ez0U8k8sOEesxN08HlW9XfQNeKxkM+j/I6SRGN8\n/RMtTO697On6gG7XoB8pILWeP/L24hkjgn/v5lYpYE4CffM6tZt84G5+bRzaa+jp\nRdvdbIqWVNGpu7XuuryzB7ErolFVIsu3RpGSnp8Uj85cdCO/9hWM9joq0tpqjFZc\nQe+aSw0fJFnrBMUbB4T65HXrpzCYYW2lf0kAY9u9zVicHtNTeA+Dqp71+t38KI4E\nv30rUVfQUzm+6At+8k/cb50mETISDib8wWSogzc2MfnLA3tSrODDPNKLVaxRRkvu\n+ORY2EPatqojwBxhsmneGlFV3Cnr4LsXeBtFIHfqhQKBgQD4eI/cXGfnz+MALvGe\nSitDotzUnY8A0XXTMRTH1cVXqtkQq0MUXHTGwp0/E7Nc4ANU1nWhFSihy/s4ixri\nyGnPE3gvnplcIimmzybeA/3ApXxSUIgri2FAkbuAzcyOFHsKAvre+oVC3KbFXIf9\nVlfD6p/kEyPIt070n7M3w640ZQKBgQDV6baTDCTNkSGrbcOnZ5bDfD+qQcLa9UJ9\nWcjoappC0C+X+w1E7xI60MQ97tOPuMxXp6oVSw7hIHjDHIV4ux1QSSa8N4e6q36U\ndOSzT6jWXYL4H2AfBtMMGu0RrPhZ8+KYZ3HsMA0yCM8yJXwKQhctlVg4vguGvE6R\n8TsI3edXjQKBgFlCPjPkQjNlW9+5/XRmooomnHwIqdGabWBT1mo/YigvKNEzJOLQ\nn+azDPgW5K0tkCTO8ezPBAyzkWjrl9n2MwR/swIwUFlnsFzLN+QzvNmS2Ulcwr4Z\n0PL4J0qLI7u6ocSj82lcx7iQOZzWs8ePV/H6fDvboFQ/fa6lHCWhNxh9AoGBAK4D\nhqtOiK3Vb19mVnBbO3DhJWVaQ6odNC6GmIJBHiZV9zGaX+wA04KXC90Z6G6VNV3l\nHd5ehccrxDFshUN2a91A9MrOHZMEKV+ZS+Z2WfGwdndkBqyWv56sVMg5PnrmhCHY\nnPs3B7T5J5wylBpAM1y4jeDy8Kt1ijD83TpUUfqNAoGAdXDXERK0gLpdood6X/rF\nZUtgeM8DdLHWZm4CX4weOdGDiMJZ2fb8MVF0k6tOuSr7eA+YQCPLJrj4OIavPVAN\nlnLnW0TsHzjoU3zhQh/1SxV2TU58q5ZfhKcL4GDMrNTfy/aB+0C9FbdPf1WKOwOQ\ndIRi+GF3RMtuJyq1EqTDRmE=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@studentapp-61a45.iam.gserviceaccount.com",
  client_id: "108548604822800603599",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40studentapp-61a45.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "studentapp-61a45.appspot.com"
});

const db = admin.firestore();
const storage = admin.storage();

module.exports = { admin, db, storage };
