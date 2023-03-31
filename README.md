## Stack
MANSWHERE uses the **React** JavaScript library for building **user interfaces** and depends on **Next.js** for development. Backend relies on **Next.js API**, **Firebase** for **image** hosting and **MongoDB** for regular data

## Features (Regular)
- **Fully responsive**, **role-dependent** pages.
- **JWT**-based **authentication** and **authorization** running on Node-based Next.js APIs.
- Smooth shop **catalogue** built with **CSS Grid** with **filters** and **sorting**. 
- **Dynamic** shop item **page** based on **URL slugs**.
- **Session-based** shopping **cart**.
- **Order creation**, viewing **recent orders** , wishlisting

## Features (Administrator)
- Shop **item creation**, with image support.
- **User**, **order** **querying** by IDs.
- Live statistic preview

## Demo account (or register your own!)

Username: **testUser2**
Password:  **TestUser!1234**

## Dependencies

    "@headlessui/react": "^1.7.13",
    "axios": "^1.3.2",
    "bcryptjs": "^2.4.3",
    "cookies-next": "^2.1.1",
    "dotenv": "^16.0.3",
    "eslint": "8.27.0",
    "eslint-config-next": "13.0.3",
    "firebase": "^9.17.2",
    "formidable": "^2.1.1",
    "formik": "^2.2.9",
    "framer-motion": "^6.5.1",
    "jose": "^4.12.0",
    "jsonwebtoken": "^9.0.0",
    "mongodb": "^4.14.0",
    "mongoose": "^6.9.1",
    "next": "13.0.3",
    "order-id": "^2.1.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-query": "^3.39.3",
    "react-scroll": "^1.8.8",
    "yup": "^0.32.11"

## Environmental Variables

    MONGODB_PATH=''
    NODE_ENV=''
    SECRET=''      // signing jwt
    FIREBASE_API=''
    FIREBASE_SENDER_ID=''
    FIREBASE_APP_ID=''
