import * as admin from 'firebase-admin';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env file
config();

// Initialize Firebase Admin SDK
const serviceAccount =  path.join(__dirname, 'config', 'eventful-eb4ee-firebase-adminsdk-l20qb-1afe6a7124.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// Access Firebase services
const bucket = admin.storage().bucket();

export { admin, bucket };
