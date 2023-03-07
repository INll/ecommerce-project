import bcrypt from 'bcryptjs';  
// TODO: hash all incoming password strings and stored hashed versions on server
//       read usage: https://www.npmjs.com/package/bcrypt
import { setCookie } from 'cookies-next';
import Cookies from 'universal-cookie';
import { signToken } from '../../lib/token.js';
import dbConnect from '../../lib/mongoose.js';
import { userSchema } from '../../../backend/Models/user.js';
import mongoose from 'mongoose';


function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
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

    // connect to db, return a connection object
    await dbConnect();

    // declare model after connecting to mongoDB
    // note that directly importing a model DOES NOT WORK, it will become a rogue
    // model that is not associated with the current connection, and will result
    // in time out error 
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    if (req.method === 'POST') {
      // destructure req
      let { userName, passWord, passWordConfirmation } = req.body.value;
      const isReg = req.body.isReg;
      
      const cookies = new Cookies(req.cookies);

      // check data
      if (!userName || !passWord ) {
        res.status(422).json({ message: 'Invalid user data' });
      }
      // main logic 
      try {
        const userExists = await User.exists({ userName: userName });

        // login logics
        if (!isReg) {
          if (userExists == null) {
            // user not found, send user to signup
            res.status(200).json({ loginResult: 0 });
          } else {
            const user = await User.findOne({ userName: userName });
            if (
              bcrypt.compareSync(passWord, user.passWord) ||
              passWord == user.passWord  // for 'adminadmin' 
            ) {
              // update lastLogin
              user.lastLogin = Date.now();
              await user.save();

              user.passWord = undefined;  // Erase pass sensitive info
              // user._id = undefined;  // this doesn't work
              user.__v = undefined;
              console.log('about to send' + user);
              console.log('type: ' + typeof user);
              let token = await signToken(user);
              setCookie('token', token, { req, res, httpOnly: true });  // sign jwt
              // cookies.set('token', token, { httpOnly: true, path: '/' });
              res.status(200).json({ loginResult: 1, token: token, user: user });
            } else {
              res.status(200).json({ loginResult: 2, token: null });
            }
          }

        // sign up logics
        } else if (isReg) {
          if (userExists != null) {
            res.status(200).json({ loginResult: 3 });
          } else {
            let newUserDetails = {
              userName: userName,
              passWord: bcrypt.hashSync(passWord, 10),
              clearance: 0,
            }
            let newUser = await User.create(newUserDetails);
            let token = await signToken(newUser);
            setCookie('token', token, { req, res, httpOnly: true });
            // cookies.set('token', token, { httpOnly: true, path: '/' });
            res.status(200).json({ loginResult: 4, token: token, user: newUser });
          }
        }
      } catch (err) {
        // await mongoose.connection.close();
        handleError(err, res);
      }
    } else {
      res.status(405).json({ message: 'Invalid method' });
      return;
    }
  } catch (err) {
    // await mongoose.connection.close();
    handleError(err);
  }
}