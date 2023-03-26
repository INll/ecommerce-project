import bcrypt from 'bcryptjs';
import Cookies from 'universal-cookie';
import { setCookie } from 'cookies-next';
import { signToken } from '@/lib/token';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/user';


const EIGHT_HOURS = 8*60*60*1000;   // mongodb saves Date in GMT by default

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

    if (req.method === 'POST') {
      // destructure req
      let { userName, passWord } = req.body.value;
      const isReg = req.body.isReg;
      
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

              user.lastLogin = Date.now() + EIGHT_HOURS;
              await user.save();

              user.passWord = undefined;  // Erase pass sensitive info
              // user._id = undefined;  // this doesn't work
              user.__v = undefined;
              // sign jwt
              let token = await signToken(user);
              setCookie('token', token, { req, res, httpOnly: true });
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
              creationTime: Date.now() + EIGHT_HOURS,
              lastLogin: Date.now() + EIGHT_HOURS,
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