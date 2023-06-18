import admin from 'firebase-admin';
import dotenv from 'dotenv';
import env from './env.js'

dotenv.config();
admin.initializeApp({
  credential: admin.credential.cert(env('GOOGLE_APPLICATION_CREDENTIALS'))
});

export const messaging = admin.messaging();