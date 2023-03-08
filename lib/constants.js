import * as dotenv from 'dotenv';
dotenv.config();

let constants;

export default constants = {
  dbPath: process.env.MONGODB_PATH,
  jwtSecret: process.env.SECRET,
  firebaseAPI: process.env.FIREBASE_API.at,
  firebaseSenderID: process.env.FIREBASE_SENDER_ID,
  firebaseAppID: process.env.FIREBASE_APP_ID,
};