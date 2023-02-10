import hash from 'bcryptjs';
import dbConnect from '../../lib/mongoose.js';
import User from '../../../backend/Models/user.js';

function handleError (err, res) {
  console.log(`Caught Error: ${err}`);
  res.json(err);
  res.status(405).end();
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userName, passWord, passWordConfirmation } = req.body;
    // check data
    if (!userName || !passWord ) {
      res.status(422).json({ message: 'Invalid user data' });
    }
    // main logic 
    try {
      // connect is handled globally with dbConnect
      await dbConnect();

      const userNameExists = await User.exists({ userName: userName });
      console.log(userNameExists);
      res.send(userNameExists);
      // if (userNameExists) {

      // } else {
      //   res.status(401).json({ message: 'User does not exist'});
      // }
    } catch (err) {
      handleError(err, res);
    }
  } else {
    res.status(405).json({ message: 'Invalid route' });
    return;
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