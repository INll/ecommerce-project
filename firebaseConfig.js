import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import constants from "./lib/constants";

// Initialize Firebase
const firebaseConfig = {
  apiKey: constants.firebaseAPI,
  authDomain: "ecommerce-14a89.firebaseapp.com",
  projectId: "ecommerce-14a89",
  storageBucket: "ecommerce-14a89.appspot.com",
  messagingSenderId: constants.firebaseSenderID,
  appId: constants.firebaseAppID,
  measurementId: "G-3XVSP2BX12"
};

const app = initializeApp(firebaseConfig);

// Firebase storage reference
const storage = getStorage(app);
export { storage };