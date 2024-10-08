import * as admin from "firebase-admin";
import { config } from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables from .env file
config();

// Initialize Firebase Admin SDK
const serviceAccount =
  process.env.NODE_ENV === "production"
    ? process.env.FIREBASE_SERVICE_ACCOUNT
    : path.join(
        __dirname,
        "eventful-eb4ee-firebase-adminsdk-l20qb-1afe6a7124.json"
      );

let credential;

if (process.env.NODE_ENV === "production") {
  if (serviceAccount) {
    if (fs.existsSync(serviceAccount)) {
      const serviceAccountJson = JSON.parse(
        fs.readFileSync(serviceAccount, "utf8")
      );
      credential = admin.credential.cert(serviceAccountJson);
    } else {
      throw new Error(
        `Service account file not found at path: ${serviceAccount}`
      );
    }
  } else {
    throw new Error("Service account path is not defined.");
  }
} else {
  if (serviceAccount) {
    // In development, use the local JSON file
    if (fs.existsSync(serviceAccount)) {
      const serviceAccountJson = serviceAccount
        ? JSON.parse(fs.readFileSync(serviceAccount, "utf8"))
        : null;
      credential = admin.credential.cert(serviceAccountJson);
    } else {
      throw new Error(
        `Service account file not found at path: ${serviceAccount}`
      );
    }
  }else{
    throw new Error("Service account path is not defined.");
  }
}

admin.initializeApp({
  credential,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// Access Firebase services
const bucket = admin.storage().bucket();

export { admin, bucket };
