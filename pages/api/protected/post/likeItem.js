import dbConnect from '@/lib/mongoose';
import { User } from '@/models/user';
import constants from '@/lib/constants';
import * as jose from 'jose';

function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
}

export default async function handler(req, res) {
  try {
    await dbConnect();  // use global connection
      
    if (req.method === 'POST') {
      let token = req.cookies.token;
      const key = new TextEncoder().encode(constants.jwtSecret);
      const { payload } = await jose.jwtVerify(token, key);
      
      // if credentials from jwt and request (reqPayload) do not match
      if (payload.payload.userName !== req.body.user.userName) {
        return res.status(401).json({ message: `Disagreeing credentials`, result: 2})
      };

      // update user favItems
      await User.updateOne({ userName: payload.payload.userName }, { $addToSet : { favItems: req.body.item._id } })
      let updatedUser = await User.findOne({ userName: payload.payload.userName}).exec();
      return res.status(200).json({ message: `${req.body.item.title} has been added to favourites!`, user: updatedUser, result: 1 });
    } else {
      return res.status(405).json({ message: 'Invalid method', result: 0 });
    }
  } catch (err) {
    handleError(err, res);
    return res.status(500).send({ error: err, result: 0 });
  }
}