import dbConnect from '../../../../../lib/mongoose';
import { ItemSchema } from '../../../../../../backend/Models/item';
import { userSchema } from '../../../../../../backend/Models/user.js';
import constants from '../../../../../lib/constants';
import formidable from 'formidable';
import mongoose from 'mongoose';
import * as jose from 'jose';
import fs from 'fs';
import { storage, analytics } from '../../../../../firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';

export const config = {
  api: {
    bodyParser: false,
  },
};

function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
}

const formidableOpts = {
  multiples: false,
  maxFileSize: 3 * 1024 * 1024,
}

let imgPath;  // path on Firebase Storage bucket
let username;  // connecting user

// upload image as uint8array to Firebase Storage
function handleUpload(bytes, newFilename) {
  if (!bytes) throw new Error('Firebase upload: File Invalid');
  const path = `images/${newFilename}.png`;

  const storageRef = ref(storage, path);  // path on cloud
  uploadBytes(storageRef, bytes).then((snapshot) => {
    console.log('Upload successful');
  });
  return path;
};

export default async function handler(req, res) {
  try {
    await dbConnect();  // use global connection
    const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
    const User = mongoose.models.User || mongoose.model('User', userSchema);
  
    if (req.method === 'POST') {

      let token = req.cookies.token;
      const key = new TextEncoder().encode(constants.jwtSecret);

      // check upload limits (admin: unlimited, other admins: one)
      const { payload } = await jose.jwtVerify(token, key);
      username = payload.payload.userName;
      console.log('user: ' + username);
                    //  admin      
      if (username !== 'admin') {
        let uploadCount = await User.findOne({ userName: username }, 'hasUploaded').exec();
        console.log('checking upload count... ' + uploadCount.hasUploaded);
        if (uploadCount.hasUploaded >= 1) return res.json({ message: `Upload limit reached`, result: 2 });
      }

      // parse incoming form
      const form = formidable(formidableOpts);

      form.parse(req, async (err, fields, files) => {
        if (err) {
          handleError(err);
          return res.status(500).send({ error: err, result: 0 });;
        };

        // allow requests with no image
        if (Object.keys(files).length !== 0) {
          // upload files to Firestore
          const imgName = files.file.newFilename;
          const imgBytes = fs.readFileSync(files.file.filepath);  // returns Buffer
          imgPath = handleUpload(imgBytes, imgName);
        } else {
          imgPath = null;
        }

        // create item in MongoDB
        let newItem = await Item.create({
          itemType: fields.type,
          price: fields.price,
          images: imgPath,
          title: fields.title,
          description: fields.desc,
          stock: fields.stock
        })
        console.log(`Item created successfully: ${newItem}`)

        // update user hasUploaded to 1 to disallow further uploads
        await User.updateOne({ userName: username }, { $inc: { hasUploaded: 1 } })
        return res.status(200).json({ message: `Item ${fields.title} created successfully`, result: 1 });
      });
      // Why does this still throw API resolved without response warning?
    } else {
      return res.status(405).json({ message: 'Invalid method', result: 0 });
    }
  } catch (err) {
    handleError(err, res);
    return res.status(500).send({ error: err, result: 0 });
  }
}