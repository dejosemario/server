import * as admin from "firebase-admin";
import { config } from "dotenv";
import path from "path";

// Load environment variables from .env file
config();

// Initialize Firebase Admin SDK
const serviceAccount =
  process.env.NODE_ENV === "production"
    ? process.env.FIREBASE_SERVICE_ACCOUNT
    : path.join(
        __dirname,
        "config",
        "eventful-eb4ee-firebase-adminsdk-l20qb-1afe6a7124.json"
      );

let credential;
if (serviceAccount) {
  credential = admin.credential.cert(serviceAccount);
} else {
  // Handle the case when serviceAccount is undefined
  // You can throw an error, log a message, or provide a default value
  throw new Error("Firebase service account is not defined.");
}

admin.initializeApp({
  credential,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// Access Firebase services
const bucket = admin.storage().bucket();

export { admin, bucket };
