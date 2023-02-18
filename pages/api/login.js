import hash from 'bcryptjs';
import dbConnect from '../../lib/mongoose.js';
import { userSchema } from '../../../backend/Models/user.js';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

function handleError (err, res) {
  console.error(`Error: ${err}`);
  res.json(err);
  res.status(405).end();
}


export default async function handler(req, res) {
  try {
    mongoose.connection.on('connecting', () => console.info('database connecting'));
    mongoose.connection.on('connected', () => console.info('database connected'));
    mongoose.connection.on('disconnecting', () => console.info('database disconnecting'));
    mongoose.connection.on('disconnected', () => console.info('database disconnected'));
    mongoose.connection.on('error', () => console.error('database error'));
    mongoose.set('bufferCommands', false);
    mongoose.set('debug', true);
    mongoose.set('strictQuery', false);

    // connect to db, return a connectin object
    await dbConnect();

    // declare model after connecting to mongoDB
    // note that directly importing a model DOES NOT WORK, it will become a rogue
    // model that is not associated with the current connection, and will result
    // in time out error 
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    if (req.method === 'POST') {
      console.log(req.body);
      // destructure req
      const { userName, passWord, passWordConfirmation } = req.body;
      // check data
      if (!userName || !passWord ) {
        res.status(422).json({ message: 'Invalid user data' });
      }
      // main logic 
      try {
        const result = await User.exists({ userName: userName });
        if (result == null) {
          res.status(200).json({ loginResult: 0 });
        } else {

        }
        // console.log(result);
        // if (!userNameExists) {
        //   res.sen
        // }
        // if (userNameExists) {
  
        // } else {
        //   res.status(401).json({ message: 'User does not exist'});
        // }
      } catch (err) {
        // await mongoose.connection.close();
        handleError(err, res);
      }
    } else {
      res.status(405).json({ message: 'Invalid route' });
      return;
    }
  } catch (err) {
    // await mongoose.connection.close();
    handleError(err);
  }

}





// // check data
// if (!userName || !passWord ) {
//   res.status(422).json({ 
//     message: 'Invalid User Data'
//   });
//   return;
// } 
// if (!process.env.MONGODB_PATH){
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
// } 

// function handleError (err) {
//   console.error(err);
// }

// // connect to db
// try {
//   await 
// } catch (err) {
//   handleError(err);
// }
// // const client = new MongoClient(process.env.MONGODB_PATH, {
// //   useNewUrlParser: true,
// //   useUninifedTopology: true
// // })
// // main logics
// try {
//   const db = client.db();
//   // check admin
//   const checkIfExists = await db
//     .collection('Cluster0')
//     .findOne({ userName: userName });
//   if (checkIfExists) {
//     res.status(422).json({ 
//       message: 'User already exists'
//   });
//   await client.close();
//   return;
//   }
//   // register if user name is available for use
//   const registrationStatus = await 
// } catch (err) {
//   console.error(err);
//   await client.close();
// }